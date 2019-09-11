/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItem = `subscription OnCreateItem(
  $project_id: String
  $type_id: String
  $version: Int
) {
  onCreateItem(project_id: $project_id, type_id: $type_id, version: $version) {
    budget
    consumed_budget
    date
    end_date
    hours
    manager
    name
    project_id
    project_type
    rate
    required_hours
    resource_id
    role
    start_date
    status
    type_id
    version
  }
}
`;
export const onUpdateItem = `subscription OnUpdateItem(
  $project_id: String
  $type_id: String
  $version: Int
) {
  onUpdateItem(project_id: $project_id, type_id: $type_id, version: $version) {
    budget
    consumed_budget
    date
    end_date
    hours
    manager
    name
    project_id
    project_type
    rate
    required_hours
    resource_id
    role
    start_date
    status
    type_id
    version
  }
}
`;
export const onDeleteItem = `subscription OnDeleteItem(
  $project_id: String
  $type_id: String
  $version: Int
) {
  onDeleteItem(project_id: $project_id, type_id: $type_id, version: $version) {
    budget
    consumed_budget
    date
    end_date
    hours
    manager
    name
    project_id
    project_type
    rate
    required_hours
    resource_id
    role
    start_date
    status
    type_id
    version
  }
}
`;
