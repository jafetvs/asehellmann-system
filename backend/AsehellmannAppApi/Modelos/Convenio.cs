public class Convenio
{
   
    public int Id { get; set; }
    public string nombre { get; set; }
    public string correo { get; set; }
    public string contacto { get; set; }
    public string description { get; set; }
    public string enlacePaginaWeb { get; set; }
    public string status { get; set; }


    public Convenio(int id, string nombre, string correo, string contacto, string description, string enlacePaginaWeb, string status)
    {
        this.Id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contacto = contacto;
        this.description = description;
        this.enlacePaginaWeb = enlacePaginaWeb;
        this.status = status;
    }

    public Convenio()
    {
        
    }
}