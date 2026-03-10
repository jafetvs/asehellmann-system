namespace AsehellmannAppApi.Modelos.ModeloDto.UsuarioDtos
{
    public class MostrarTodoUsuarioDto
    {
        public string cedula { get; set; }
        public int idEmpleado { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public string email { get; set; }
        public string status { get; set; }
        public List<string> roles { get; set; }
    }
}
