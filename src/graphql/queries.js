/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItem = `query GetItem($type_id: String!, $version: Int!) {
  getItem(type_id: $type_id, version: $version) {
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
export const listItems = `query ListItems(
  $filter: TableItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const queryItemsByVersionTypeIdIndex = `query QueryItemsByVersionTypeIdIndex(
  $version: Int!
  $first: Int
  $after: String
) {
  queryItemsByVersionTypeIdIndex(
    version: $version
    first: $first
    after: $after
  ) {
    items {
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
    nextToken
  }
}
`;
