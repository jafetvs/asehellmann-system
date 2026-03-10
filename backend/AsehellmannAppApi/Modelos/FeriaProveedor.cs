using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AsehellmannAppApi.Modelos
{
    public class FeriaProveedor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idFeriaProveedor { get; set; }
        public string nombreProveedor { get; set; }
        public float ventaTotales { get; set; }
       public DateTime fechaFeria { get; set; }
    }
}
