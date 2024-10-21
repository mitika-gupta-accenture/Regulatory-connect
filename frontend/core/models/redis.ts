'use server';

import { createClient } from 'redis';
import { cookies } from 'next/headers';
import _ from 'lodash';
import { LocalStorage } from 'node-localstorage';
import { UploadFile } from './file';
import { getSecretValue } from 'core/services/keyVaultHelper';

//USE_LOCAL_STORAGE flag should be set to true only when working in local
const USE_LOCAL_STORAGE = false;

class Redis {
  private static _instance: Redis;
  private _client!: ReturnType<typeof createClient>;
  private _localStorage = USE_LOCAL_STORAGE
    ? new LocalStorage('./local-storage')
    : null;

  async setupClient() {
    if (USE_LOCAL_STORAGE) {
      this._client = {
        // @ts-expect-error Local only
        get: field => this._localStorage?.getItem(field),
        // @ts-expect-error Local only
        set: (field, value) => this._localStorage?.setItem(field, value),
        // @ts-expect-error Local only
        hGet: (id, field) => this._localStorage?.getItem(`${id}-${field}`),
        hSet: (id, field, value) =>
          // @ts-expect-error Local only
          this._localStorage?.setItem(`${id}-${field}`, value),
        // @ts-expect-error Local only
        hGetAll: id => {
          // @ts-expect-error Local only
          const keys = this._localStorage?._keys.filter(
            // @ts-expect-error Local only
            key => key.startsWith(id) && !key.endsWith('steps'),
          );
          return Object.assign(
            {},
            // @ts-expect-error Local only
            keys.map(key => this._localStorage?.getItem(key)),
          );
        },
        // @ts-expect-error Local only
        del: _ => {
          this._localStorage?.clear();
          return Promise.resolve();
        },
        hDel: (id, field) =>
          // @ts-expect-error Local only
          this._localStorage?.removeItem(`${id}-${field}`),
      };
    } else {
      const RedisCacheHostName = process.env.RC_R2_REDIS_CACHE_HOST;
      const RedisCacheAccessKey = await getSecretValue(
        'REDIS-CACHE-ACCESS-KEY',
      );
      this._client = await createClient({
        url: `rediss://${RedisCacheHostName}:6380`,
        password: RedisCacheAccessKey,
        socket: {
          tls: true,
          host: RedisCacheHostName,
          port: 6380,
          servername: RedisCacheHostName,
          rejectUnauthorized: false,
        },
        pingInterval: 9 * 1000 * 60,
      });
      this._client?.on('error', err => {
        console.error('Redis Client Error', err);
        throw err;
      });

      await this._client?.connect();
    }
  }

  static async getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Redis();
    await this._instance.setupClient();
    return this._instance;
  }

  getSessionId() {
    return cookies().get('session_cookie')?.value;
  }

  private getDefiniteSessionId() {
    // We can (mostly) be certain the fallback will never be used
    // As having no session ID will bounce the user back to a session expired
    // screen
    return this.getSessionId() || 'invalid_session';
  }

  async getAnswer<T>(field: string): Promise<T | null> {
    const answer = await this._client?.hGet(this.getDefiniteSessionId(), field);
    return answer ? (JSON.parse(answer) as T) : null;
  }

  async get<T>(field: string): Promise<T | null> {
    const answer = await this._client?.get(
      `${this.getDefiniteSessionId()}-${field}`,
    );
    return answer ? (JSON.parse(answer) as T) : null;
  }

  async setAnswer(field: string, value: unknown) {
    return await this._client?.hSet(
      this.getDefiniteSessionId(),
      field,
      JSON.stringify(value),
    );
  }

  async set(field: string, value: unknown) {
    return await this._client?.set(
      `${this.getDefiniteSessionId()}-${field}`,
      JSON.stringify(value),
    );
  }

  async setFormState(field: string, value: unknown) {
    return await this._client?.hSet(
      `${this.getDefiniteSessionId()}-form-state`,
      field,
      JSON.stringify(value),
    );
  }

  async getFormState<T>(field: string): Promise<T | null> {
    const formState = await this._client?.hGet(
      `${this.getDefiniteSessionId()}-form-state`,
      field,
    );
    return formState ? (JSON.parse(formState) as T) : null;
  }

  async getFullFormState<T>(): Promise<Array<Record<string, T>>> {
    const fullFormState = await this._client?.hGetAll(
      `${this.getDefiniteSessionId()}-form-state`,
    );
    return _.map(_.entries(fullFormState), ([k, v]) => ({
      [k]: JSON.parse(v) as T,
    }));
  }

  async getAllAnswers<T>(): Promise<Array<T>> {
    const allAnswers = await this._client?.hGetAll(this.getDefiniteSessionId());
    return Object.values(_.mapValues(allAnswers, val => JSON.parse(val) as T));
  }

  async setOrAppendFile(file: UploadFile) {
    const key = `files-${this.getDefiniteSessionId()}`;
    let existing: UploadFile[] = [];
    const existingStr = await this._client?.get(key);
    if (existingStr !== null) {
      existing = JSON.parse(existingStr) as UploadFile[];
    }
    const newFiles = [...existing, file];
    return await this._client?.set(key, JSON.stringify(newFiles));
  }

  async getFiles() {
    const files = await this._client?.get(
      `files-${this.getDefiniteSessionId()}`,
    );
    return files ? (JSON.parse(files) as UploadFile[]) : [];
  }

  async deleteFile(blobName: string | string[]) {
    const key = `files-${this.getDefiniteSessionId()}`;
    let existing: UploadFile[] = [];
    const existingStr = await this._client?.get(key);
    if (existingStr !== null) {
      existing = JSON.parse(existingStr) as UploadFile[];
    }
    const newFiles = existing.filter(file => file.blobName !== blobName);
    return await this._client?.set(key, JSON.stringify(newFiles));
  }

  async clear() {
    const sessionId = this.getDefiniteSessionId();
    await this._client?.del(sessionId);
    await this._client?.del(`files-${sessionId}`);
    await this._client?.del(`${sessionId}-steps`);
    await this._client?.del(`${sessionId}-form-state`);
  }

  async clearAnswer(field: string) {
    await this._client?.hDel(this.getDefiniteSessionId(), field);
  }
}

export const getAnswer = async <T>(field: string) => {
  const instance = await Redis.getInstance();
  return await instance.getAnswer<T>(field);
};
export const get = async <T>(field: string) => {
  const instance = await Redis.getInstance();
  return await instance.get<T>(field);
};
export const setAnswer = async (field: string, value: unknown) => {
  const instance = await Redis.getInstance();
  return await instance.setAnswer(field, value);
};
export const set = async (field: string, value: unknown) => {
  const instance = await Redis.getInstance();
  return await instance.set(field, value);
};
export const setFormState = async (field: string, value: unknown) => {
  const instance = await Redis.getInstance();
  return await instance.setFormState(field, value);
};
export const getFormState = async (field: string) => {
  const instance = await Redis.getInstance();
  return await instance.getFormState(field);
};
export const getFullFormState = async () => {
  const instance = await Redis.getInstance();
  return await instance.getFullFormState();
};
export const getAllAnswers = async <T>() => {
  const instance = await Redis.getInstance();
  return await instance.getAllAnswers<T>();
};
export const getFiles = async () => {
  const instance = await Redis.getInstance();
  return await instance.getFiles();
};
export const setOrAppendFile = async (file: UploadFile) => {
  const instance = await Redis.getInstance();
  return await instance.setOrAppendFile(file);
};
export const deleteFile = async (blobName: string | string[]) => {
  const instance = await Redis.getInstance();
  return await instance.deleteFile(blobName);
};
export const clear = async () => {
  const instance = await Redis.getInstance();
  return await instance.clear();
};
export const clearAnswer = async (field: string) => {
  const instance = await Redis.getInstance();
  return await instance.clearAnswer(field);
};
