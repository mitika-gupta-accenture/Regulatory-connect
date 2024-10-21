import { getAllAnswersAction } from "../../../../app/actions";
import { clearOnlyAnswers } from "../../../apis/common/clearOnlyAnswers";
import { clearAnswer } from "../../../models/redis";

// Mock the action and the redis model
jest.mock('../../../../app/actions', () => ({
  getAllAnswersAction: jest.fn(),
}));

jest.mock('../../../models/redis', () => ({
  clearAnswer: jest.fn(),
}));

describe('clearOnlyAnswers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear answers when there are valid answers', async () => {
    const mockAnswers = [
      { identifier: '1', answers: [1, 2] },
      { identifier: '2', answers: [] },
      { identifier: '3', answers: [3] },
    ];

    // Cast the mock to a function that returns a Promise
    (getAllAnswersAction as jest.Mock).mockResolvedValue(mockAnswers);

    await clearOnlyAnswers();

    expect(getAllAnswersAction).toHaveBeenCalledTimes(1);
    expect(clearAnswer).toHaveBeenCalledTimes(2);
    expect(clearAnswer).toHaveBeenCalledWith('1');
    expect(clearAnswer).toHaveBeenCalledWith('3');
  });

  it('should not call clearAnswer if there are no valid answers', async () => {
    const mockAnswers = [
      { identifier: '1', answers: [] },
      { identifier: '2', answers: [] },
    ];

    (getAllAnswersAction as jest.Mock).mockResolvedValue(mockAnswers);

    await clearOnlyAnswers();

    expect(getAllAnswersAction).toHaveBeenCalledTimes(1);
    expect(clearAnswer).not.toHaveBeenCalled();
  });

  it('should handle empty answers array gracefully', async () => {
    const mockAnswers: any[] = []; // Adjust type as needed

    (getAllAnswersAction as jest.Mock).mockResolvedValue(mockAnswers);

    await clearOnlyAnswers();

    expect(getAllAnswersAction).toHaveBeenCalledTimes(1);
    expect(clearAnswer).not.toHaveBeenCalled();
  });
});