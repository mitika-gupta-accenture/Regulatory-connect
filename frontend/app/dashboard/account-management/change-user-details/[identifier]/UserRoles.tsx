import { useEffect, useState } from 'react';
import { RolesAndServiceGroups } from 'core/models/apiModel';
import getRolesAndServiceGroups from 'core/apis/cam/getRolesAndServiceGroups';

export function UserRoles({
  errors,
}: {
  errors: { roleError: string; serviceGroupError: string };
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>('');
  const [roles, setRoles] = useState<RolesAndServiceGroups | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('fetching data');
        const response = await getRolesAndServiceGroups();
        setRoles(response);
      } catch (err) {
        console.error(err);
      }
    };
    if (!roles) {
      void fetchData();
    }
  }, [roles]);

  const handleChange = (selectedValue: React.ChangeEvent<HTMLInputElement>) => {
    console.log(selectedValue.target.value);
    setSelectedRole(selectedValue?.target.value);
  };

  const errorClassName = errors.roleError
    ? 'govuk-form-group govuk-form-group--error'
    : 'govuk-form-group';

  const checkboxClass = errors.serviceGroupError
    ? 'govuk-form-group govuk-form-group--error'
    : 'govuk-form-group';

  if (roles) {
    return (
      <div className={errorClassName}>
        <fieldset className="govuk-fieldset" aria-describedby="signIn-hint">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h2 className="govuk-heading-l">Change a user role</h2>
            <label className="govuk-label" htmlFor="user-perms">
              User permissions
            </label>
          </legend>
          {errors.roleError && (
            <p id={`user-role-error`} className="govuk-error-message">
              {errors.roleError}
            </p>
          )}
          <div
            id="user-roles"
            className="govuk-radios"
            data-module="govuk-radios"
          >
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="Admin"
                name="user-role"
                type="radio"
                value={roles.roles.find(role => role.label === 'Admin')?.value}
                aria-describedby="admin-hint"
                onChange={handleChange}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="admin-radio"
              >
                Admin
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="manager"
                name="user-role"
                type="radio"
                value={
                  roles.roles.find(role => role.label === 'Manager')?.value
                }
                aria-describedby="signIn-itm-hint"
                onChange={handleChange}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="signIn"
              >
                Manager
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="contributor"
                name="user-role"
                type="radio"
                value={
                  roles.roles.find(role => role.label === 'Contributor')?.value
                }
                aria-describedby="signIn-2-item-hint"
                onChange={handleChange}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="signIn-2"
              >
                Contributor
              </label>
              <div
                id="signIn-2-item-hint"
                className="govuk-hint govuk-radios__hint"
              ></div>
              {Number(selectedRole) ===
              roles.roles.find(role => role.label === 'Contributor')?.value ? (
                <div id="service-groups" className={checkboxClass}>
                  <div
                    className="govuk-radios__conditional govuk-radios__conditional--hidden"
                    id="conditional-contact"
                  >
                    <div>
                      <p className="govuk-body govuk-!-font-weight-bold govuk-!-margin-top-3">
                        Assigned service groups
                      </p>
                      {errors.serviceGroupError ? (
                        <p
                          id={`user-role-error`}
                          className="govuk-error-message"
                        >
                          {errors.serviceGroupError}
                        </p>
                      ) : (
                        <div id="waste-hint" className="govuk-hint">
                          Select all that apply.
                        </div>
                      )}
                      <div
                        className="govuk-checkboxes"
                        data-module="govuk-checkboxes"
                      >
                        <div className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            id="medical-devices"
                            name="medical-devices"
                            type="checkbox"
                            value={
                              roles.serviceGroups.find(
                                role => role.label === 'Medical Devices',
                              )?.value
                            }
                          />
                          <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor="medical-devices"
                          >
                            Medical Devices
                          </label>
                        </div>
                        <div className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            id="medicinal-products"
                            name="medicinal-products"
                            type="checkbox"
                            value={
                              roles.serviceGroups.find(
                                role => role.label === 'Medicinal Products',
                              )?.value
                            }
                          />
                          <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor="medicinal-products"
                          >
                            Medicinal Products
                          </label>
                        </div>
                        <div className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            id="supply-chain"
                            name="supply-chain"
                            type="checkbox"
                            value={
                              roles.serviceGroups.find(
                                role => role.label === 'Supply Chain',
                              )?.value
                            }
                          />
                          <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor="supply-chain"
                          >
                            Supply Chain
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {Number(selectedRole) !==
                roles.roles.find(role => role.label === 'Contributor')?.value &&
              !!selectedRole ? (
                <div className="govuk-inset-text">
                  Admin and manager roles have access to all service groups
                </div>
              ) : null}
              <input
                type="hidden"
                name="contributor-value"
                value={
                  roles.roles.find(role => role.label === 'Contributor')?.value
                }
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  } else {
    return <span>Loading</span>;
  }
}
