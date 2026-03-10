using System.Collections.Generic;
using AsehellmannAppApi.Modelos.ModeloDto;
using DocumentFormat.OpenXml.Spreadsheet;
using OfficeOpenXml;

namespace AsehellmannAppApi.Servicios
{
    public class ExcelService
    {
        public List<CrearUsuarioDto> LeerDatosUsuariosDesdeExcel(string rutaArchivo)
        {
            List<CrearUsuarioDto> listaUsuarios = new List<CrearUsuarioDto>();

            try
            {
                using (var package = new ExcelPackage(new FileInfo(rutaArchivo)))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                    if (worksheet == null)
                    {
                        throw new InvalidOperationException("No se encontró la hoja de trabajo en el archivo Excel.");
                    }

                    int totalRows = worksheet.Dimension.End.Row;

                    for (int row = 2; row <= totalRows; row++)
                    {
                        var usuarioDto = new CrearUsuarioDto
                        {
                            cedula = GetStringCellValue(worksheet.Cells[row, 3]),
                            nombre = GetStringCellValue(worksheet.Cells[row, 1]),
                            apellidos = GetStringCellValue(worksheet.Cells[row, 2]),
                            idEmpleado = GetIntCellValue(worksheet.Cells[row, 4]),
                            email = GetStringCellValue(worksheet.Cells[row, 5]),
                            password = GetStringCellValue(worksheet.Cells[row, 7]),
                            role = GetStringCellValue(worksheet.Cells[row, 8]),
                            status = GetStringCellValue(worksheet.Cells[row, 6])
                        };

                        listaUsuarios.Add(usuarioDto);
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejar la excepción según tus necesidades
                Console.WriteLine($"Error durante la lectura del archivo Excel: {ex}");
            }

            return listaUsuarios;
        }

        private string GetStringCellValue(ExcelRange cell)
        {
            return cell?.Value?.ToString() ?? string.Empty;
        }

        private int GetIntCellValue(ExcelRange cell)
        {
            int result;
            if (int.TryParse(cell?.Value?.ToString(), out result))
            {
                return result;
            }
            return 0; // O manejar el valor predeterminado según tus necesidades
        }

    }
}
