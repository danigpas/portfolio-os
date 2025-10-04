import json
# Importamos el cliente que acabamos de crear
from app.db.session import supabase_client

def test_about_table():
    """
    Una función para probar la conexión y la consulta a la tabla 'about'.
    """
    print(">>> Intentando conectar y consultar la tabla 'about'...")

    try:
        # Esta es la sintaxis de Supabase-py para hacer una consulta:
        # client.table('nombre_tabla').select('columnas').execute()
        response = supabase_client.table('about').select("*").execute()

        # Los datos que nos interesan están en el atributo 'data' de la respuesta.
        data = response.data

        print("\n✅ ¡Consulta exitosa! Resultado:")
        # Usamos json.dumps para imprimir el resultado en formato JSON bonito (pretty-print)
        print(json.dumps(data, indent=4, ensure_ascii=False))

    except Exception as e:
        print(f"\n❌ Error durante la consulta: {e}")


      # Este bloque hace que la función se ejecute cuando llamamos al fichero desde la terminal.
if __name__ == "__main__":
    test_about_table()