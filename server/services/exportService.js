const ExcelJS = require('exceljs');
const Todo = require('../models/Todo');

const exportUserTodos = async (userId) => {
  try {
    console.log('Fetching todos for user:', userId);
    const todos = await Todo.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
    console.log('Found', todos.length, 'todos');

    console.log('Creating workbook');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Todos');
    console.log('Worksheet created');

    // Define columns
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Tags', key: 'tags', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];
    console.log('Columns defined');

    // Add data rows
    console.log('Adding todo rows');
    todos.forEach(todo => {
      try {
        worksheet.addRow({
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          tags: todo.tags?.join(', ') || '',
          createdAt: todo.createdAt.toLocaleString()
        });
      } catch (rowError) {
        console.error('Error adding row for todo:', todo._id, rowError);
        throw rowError;
      }
    });

    console.log('Styling header row');
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
    });

    console.log('Creating Excel buffer');
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Buffer created successfully');
    return buffer;
  } catch (error) {
    console.error('Error in exportUserTodos:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
};

module.exports = {
  exportUserTodos
};
