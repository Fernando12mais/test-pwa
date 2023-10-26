type TableAction = {
  name: string
  icon: string
}

type TableContent = {
  rowId: number
  row: Record<string, { value: string }>[]
  actions: TableAction[]
}

type Pagination = {
  page: {
    actual: number
    last: number
    total: number
    visible: number
  }

  row: {
    perPage: number
    total: number
    firstIndex: number
    lastIndex: number
  }
}

export type TableData = {
  header: string[]
  content: TableContent[]
  pagination: Pagination
}

export type TableParams = {
  query: string
  currentPage: string
}
