## Pull Request Template for RMS Database Project Changes

## Database Development Workflow

![image](https://user-images.githubusercontent.com/315909/226767877-9447867f-1c65-4c11-91b2-ef5a19a6f167.png)

## Database CI/CD Workflows
![image](https://user-images.githubusercontent.com/315909/226767812-8924d593-d320-4871-9bc3-2eb2503bc140.png)

### Physical Data Model Guidelines
- All Objects will have a deleted flag.
- All entities where required will have a confidential flag.
- Dataverse Mastered Data Objects: Data objects mastered in Dataverse will follow a naming convention with a publisher prefix (e.g., mhra_userauthorisation).
- Azure SQL Mastered Data Objects: Data objects mastered in Azure SQL will follow the naming convention without a publisher prefix (e.g., externalfile).
- Replicated Dataverse Objects: Objects mastered within Dataverse and synchronized to SQL will maintain their original name from Dataverse, following the convention "publisher_object." They will be stored within the appropriate data store schema (e.g., Master Schema).
- Alias Schema for Replicated Objects: Replicated objects will be provided with an alias schema (Synonym) for consumption, aligning closer to the logical data model subject area name (may not be exact).
- Alias Name for Replicated Objects: Replicated objects will be provided with an alias name within their alias schema for consumption, aligning closer to the logical

### Index Naming Standards

Index names should be concise, descriptive, and follow a consistent pattern. The general format for index naming is IX_<TableName><ColumnName(s)><IndexType> Where: 

- `IX`: Prefix indicating it's an index. 
- `TableName`: The name of the table on which the index is created. 
- `ColumnName(s)`: The column(s) used in the index, separated by underscores if multiple columns are involved. 
- `IndexType`: The type of the index (e.g., 'NC' for non-clustered, 'CL' for clustered, 'UQ' for unique, 'FT' for full-text, etc.).

Example: `IX_Customer_LastName_NC`: A non-clustered index on the "LastName" column in the "Customer" table.

### Constraint Naming Standards

Constraints should also have clear and consistent names. The general format for constraint naming is C_<TableName><ConstraintType><ColumnName(s)> where: 

- `C`: Prefix indicating it's a constraint. 
- `TableName`: The name of the table on which the constraint is defined. 
- `ConstraintType`: The type of the constraint (e.g., 'PK' for primary key, 'FK' for foreign key, 'CK' for check, 'DF' for default, 'UQ' for unique, etc.). 
- `ColumnName(s)`: The column(s) involved in the constraint, separated by underscores if multiple columns are involved.

Example: `C_Customer_PK_CustomerID`: A primary key constraint on the "CustomerID" column in the "Customer" table. 


### Required System Columns 
| Name                               | Description                                                                                                 | DataType    |
|------------------------------------|-------------------------------------------------------------------------------------------------------------|-------------|
| ExternalId                         | External GUID to support bounded context separation as discussed above                                    | UniqueIdentifer |
| ModifiedOn                         | Datetime field to capture changes of records                                                               | Datetime    |
| Deleted                            | Soft Deleted field as no hard deletes are allowed under NFRs                                               | Bit         |
| <lookup_column_from_dataverse>_id | Natural Keys from Dataverse for entities will be stored alongside their SK representations                 | UniqueIdentifier |
| ModifiedBy                         | Modified By field for anything synchronized via Dataverse                                                  | Varchar(150) |



### PR Title
_[Title should be clear, concise, and descriptive of the changes in this PR]_

### Description
_[Provide a brief description of the changes you have made in this PR. Include any context, motivation, and decisions that led to these changes.]_

### Related Issue(s)
_[List any related issues or relevant references that this PR addresses or closes. Use the Jira Ticket Links

### Type of Change
_[Please check the type(s) of change(s) you are making in this PR. Delete any that do not apply.]_

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Database schema update (migration, model, seed, etc.)
- [ ] Documentation update (README, comments, etc.)
- [ ] Other (please describe):

### Unit Test Evidence


### Checklist
_[Please check all the items below before submitting your PR.

- [ ] I have created a branch following the gitflow strategy defined above
- [ ] I have ensured the .sql files are added to the DB Project
- [ ] I have adhered to the Physical Data Model Standards
- [ ] I have included system columns or believe I have a suitable exclusion
- [ ] I have adhered to the Microsoft SQL Best Practices
- [ ] I have adhered to the Security Model
- [ ] I have attached Unit Test Evidence
- [ ] I have considered other functional requirements (if possible)
- [ ] I have ensured the build passes
- [ ] Add or update relevant tests to ensure your changes are covered
- [ ] I have added or updated the necessary tests to cover my changes
- [ ] I have updated the documentation
- [ ] This PR contains only the necessary changes (no extra unrelated changes or refactoring)
- [ ] My changes generate no new warnings or errors
### Reviewers
 At least one member from the data team must review your PR.

### Additional Notes
_[Add any other information, context, or screenshots about this PR here. This can include any considerations, decisions, or alternative approaches related to the changes.]_
