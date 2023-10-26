import type { TableData } from './types.table'
import mock from '@/@fake-db/mock'
import { paginateArray } from '../utlis'
import axios from '@axios'

const database: TableData = {
  header: ['id', 'name', 'age', 'profession', 'hobbie'],
  content: [
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 1,
      row: [
        { id: { value: '1' } },
        { name: { value: 'FernandoA' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 2,
      row: [
        { id: { value: '2' } },
        { name: { value: 'FernandoB' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 3,
      row: [
        { id: { value: '3' } },
        { name: { value: 'FernandoC' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 4,
      row: [
        { id: { value: '4' } },
        { name: { value: 'FernandoD' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 5,
      row: [
        { id: { value: '5' } },
        { name: { value: 'FernandoE' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 6,
      row: [
        { id: { value: '6' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 7,
      row: [
        { id: { value: '7' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 8,
      row: [
        { id: { value: '8' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 9,
      row: [
        { id: { value: '9' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 10,
      row: [
        { id: { value: '10' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
    {
      actions: [
        { icon: 'tabler-pencil', name: 'Edit' },
        { icon: 'tabler-trash', name: 'Delete' },
      ],
      rowId: 11,
      row: [
        { id: { value: '11' } },
        { name: { value: 'Teste' } },
        { age: { value: '24' } },
        { profession: { value: 'Desenvolvedor' } },
        { hobbie: { value: 'Play chess' } },
      ],
    },
  ],

  pagination: {
    page: {
      actual: 1,
      last: 10,
      total: 2,
      visible: 5,
    },
    row: {
      perPage: 2,
      total: 15,
      firstIndex: 1,
      lastIndex: 3,
    },
  },
}

mock.onGet('/api/table').reply(config => {
  const { query = '', currentPage = 1 } = config.params ?? {}

  const queryLowered = query.toLowerCase()

  const filteredContents = database.content.filter(project =>
    project.row.some(
      item => item.name?.value.toLowerCase().includes(queryLowered),
    ),
  )
  const { perPage } = database.pagination.row
  const paginatedArray = paginateArray<TableData['content']>(
    filteredContents,
    database.pagination.row.perPage,
    Number(currentPage),
  )

  const totalPage = Math.ceil(filteredContents.length / perPage)
    ? Math.ceil(filteredContents.length / perPage)
    : 1

  const processedData: TableData = {
    header: database.header,
    pagination: {
      page: {
        total: totalPage,
        actual: Number(currentPage),
        visible: database.pagination.page.visible,
        last: database.pagination.page.last,
      },
      row: {
        firstIndex: paginatedArray[0].rowId,
        lastIndex: paginatedArray.at(-1)?.rowId || 0,
        perPage,
        total: database.content.length,
      },
    },

    content: paginatedArray,
  }
  return [200, processedData]
})

axios.get('/api/table')
