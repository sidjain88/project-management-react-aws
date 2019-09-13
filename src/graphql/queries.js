/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItem = `query GetItem($type_id: String!, $version: Int!) {
  getItem(type_id: $type_id, version: $version) {
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
export const listItems = `query ListItems(
  $filter: TableItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const queryItemsLatestVersionByProjectId = `query QueryItemsLatestVersionByProjectId(
  $project_id: String!
  $type: String!
  $first: Int
  $after: String
) {
  queryItemsLatestVersionByProjectId(
    project_id: $project_id
    type: $type
    first: $first
    after: $after
  ) {
    items {
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
    nextToken
  }
}
`;
export const queryItemsLatestVersionByType = `query QueryItemsLatestVersionByType(
  $type: String!
  $first: Int
  $after: String
) {
  queryItemsLatestVersionByType(type: $type, first: $first, after: $after) {
    items {
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
    nextToken
  }
}
`;
export const queryItemsLatestVersionByTypeId = `query QueryItemsLatestVersionByTypeId(
  $type_id: String!
  $first: Int
  $after: String
) {
  queryItemsLatestVersionByTypeId(
    type_id: $type_id
    first: $first
    after: $after
  ) {
    items {
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
    nextToken
  }
}
`;
export const queryTypeIdsByType = `query QueryTypeIdsByType($type: String!, $first: Int, $after: String) {
  queryTypeIdsByType(type: $type, first: $first, after: $after) {
    type_id
  }
}
`;
