
//d3.dsv(";", "01001.csv").then(function (datos) {
d3.dsv(";", "https://ine.es/jaxi/files/_px/en/csv_bdsc/t35/p011/rev19/serie/l0/01001.csv_bdsc?nocab=1")
    .then(function (datos) {
    console.log("Inicio de la actividad 1 - carga de datos")

    // Extrae valores únicos de los productos
    var productosUnicos = Array.from(new Set(datos.map(d => d.Productos)));

    // Agrega los títulos y subtítulos a la página
    d3.select("body").append("h1").text("Herramientas de visualización");
    d3.select("body").append("h2").text("Actividad 1 - Análisis tendencias en D3.js");
    //d3.select("body").append("h3").text("Elaborado por: César Fernando Balaguer García");

    console.log("Incluye los DIV para mostrar el cuadro y el gráfico")
    // Agrega un dic de cabecera donde se seleccionará el producto
    d3.select("body").append("div").attr("id", "seleccion").text("Gasto turístico receptor por productos y periodo: ")
        .style("width", "100%")
        .style("padding", "10px");
    // Agrega un div donde se mostrará una tabla con la información del csv
    d3.select("body").append("div").attr("id", "cuadro").text("")
        .style("display", "inline-block")
        .style("width", "48%")
        .style("padding", "10px");
    // Agrega un div al lado del anterior donde se mostrará la gráfica obtenida de la información del csv
    d3.select("body").append("div").attr("id", "grafico")
        .style("display", "inline-block")
        .style("width", "48%")
        .style("padding", "10px");
    
    // Agrega un select de los productos para que puede seleccionarse uno de ellos,
    // sobre el cual se  mostrará el cuadro y el gráfico, esto ser hará sobre el primer DIV de cabecera
    d3.select("#seleccion").append("p");
    d3.select("#seleccion").append("label").text("Seleccione un producto : ");
    
    // Agrega las opciones de productos sin que se repitan
    d3.select("#seleccion").append("select").attr("id", "producto")
        .selectAll("option")
        .data(productosUnicos)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
    
    // Agrega la opción de todos los productos
    d3.select("#producto")
        .append("option")
        .text("Todos los productos")
        .attr("value", "Todos los productos");
    
    // Agrega la acción change al select, según esto hará el cuadro y el gráfico
    d3.select("#producto")
        .on("change", function () {
            console.log("selecciona un producto")
            const productoSeleccionado = this.value
            // Modifica el título del DIV según el producto seleccionado
            const tituloCuadro = productoSeleccionado === "Todos los productos"
                ? "Gasto turístico receptor por producto entre los años 2016 al 2022"
                : `Gasto turístico receptor de ${productoSeleccionado} entre los años 2016 al 2022`
            d3.select("#cuadro").text(tituloCuadro);
            // Filtra el dataset según el producto seleccionado, es este nuevo dataset filtrado sobre el que se hace el cuadro y el gráficcc
            if (productoSeleccionado == "Todos los productos") {
                // En caso se haya seleccionado "Todos los Producctos" no hace filtro y envía todo
                var datoFinal = datos;
            } else {
                var datoFinal = datos.filter(d => d.Productos === productoSeleccionado);
            }
            // Llama a la función para mostrar el cuadro
            MostrarCuadro(datoFinal);
        });

    // Establece un valor por defecto en el select
    d3.select("#producto")
        .property("value", "Todos los productos")
        .dispatch("change");
});

function MostrarCuadro(datos) {
    console.log("entra a mostrar cuadro")
    // Crea la variable cuadro, con la selección del DIV con el mismo nombre
    var cuadro = d3.select("#cuadro");
    // Selecciona la tabla existente en el DIV
    tabla = cuadro.select("#tabla")
    if (tabla.empty()) {
        console.log("crea la tabla")
        // En caso no exista crea la tabla y la cabecera de la tabla
        tabla = cuadro.append("table").attr("id", "tabla");

        console.log("crea el encabezado")
        // Crea el encabezado de la tabla (fila con los títulos)
        var RowEncabezado = d3.select("#tabla");
        RowEncabezado.append("thead").attr("id", "encabezado").append("tr").attr("id", "FilaPrincipal");

        // Crea las columnas del encabezado
        d3.select("#FilaPrincipal").append("th").text("Producto");
        d3.select("#FilaPrincipal").append("th").text("Periodo");
        d3.select("#FilaPrincipal").append("th").text("Total");

        console.log("Termina la creación de la tabla y la fila de títulos");
    }
    
    console.log("creación del cuerpo de la tabla");
    // Crea variable con cuerpo de la tabla, en caso esté vacía la crea en la tabla, en caso contrario las elimina
    var contenido = tabla.select("tbody");
    if (contenido.empty()) {
        console.log("entra a crear el tbody")
        contenido = tabla.append("tbody").attr("id", "contenido");
    } else {
        console.log("elimina las filas")
        contenido.selectAll("tr").remove();
    }
    console.log("creación del cuerpo terminado")
    
    // Agrega filas a la tabla
    console.log("creación de filas")
    var filas = contenido.selectAll("tr")
        .data(datos)
        .enter()
        .append("tr")
    
    // Agrega las columnas de la tabla utilizando la data filtrada recibida en la función
    // Para el periodo utiliza únicamente los 4 primeros caracteres para tener el año
    filas.selectAll("td")
        .data(d => [d.Productos, d.periodo.substring(0, 4), d.Total])
        .enter()
        .append("td")
        .text(d => d);
}