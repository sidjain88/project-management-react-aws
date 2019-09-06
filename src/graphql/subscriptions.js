/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItem = `subscription OnCreateItem(
  $type_id: String
  $version: Int
  $name: String
  $project_type: String
  $manager: String
) {
  onCreateItem(
    type_id: $type_id
    version: $version
    name: $name
    project_type: $project_type
    manager: $manager
  ) {
    type_id
    version
    name
    project_type
    manager
    budget
    consumed_budget
    end_date
    start_date
    status
    project_id
    resource_id
    rate
    required_hours
    role
    date
    hours
  }
}
`;
export const onUpdateItem = `subscription OnUpdateItem(
  $type_id: String
  $version: Int
  $name: String
  $project_type: String
  $manager: String
) {
  onUpdateItem(
    type_id: $type_id
    version: $version
    name: $name
    project_type: $project_type
    manager: $manager
  ) {
    type_id
    version
    name
    project_type
    manager
    budget
    consumed_budget
    end_date
    start_date
    status
    project_id
    resource_id
    rate
    required_hours
    role
    date
    hours
  }
}
`;
export const onDeleteItem = `subscription OnDeleteItem(
  $type_id: String
  $version: Int
  $name: String
  $project_type: String
  $manager: String
) {
  onDeleteItem(
    type_id: $type_id
    version: $version
    name: $name
    project_type: $project_type
    manager: $manager
  ) {
    type_id
    version
    name
    project_type
    manager
    budget
    consumed_budget
    end_date
    start_date
    status
    project_id
    resource_id
    rate
    required_hours
    role
    date
    hours
  }
}
`;
