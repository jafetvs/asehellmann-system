using System.ComponentModel.DataAnnotations.Schema;

public class AporteAsociado
{
    public int id { get; set; }
    public int aportePatronal { get; set; }
    public int aportePersonal { get; set; }
    public int aportePersonalesAcumulado { get; set; } 
    public int aportePatronalesAcumulado { get; set; }
    public DateTime fechaDelAporte { get; set; }
    public DateTime fechaCreacionAporte { get; set; }
    // Agrega la propiedad UsuarioId
    [ForeignKey("Usuario")]
    public string UsuarioId { get; set; }  
    public Usuario Usuario { get; set; }

}