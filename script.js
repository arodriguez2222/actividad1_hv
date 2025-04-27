
d3.dsv(";", "01001.csv").then(function (datos) {
    //lineas de código para importar datos desde la web.
    /*
    d3.dsv(";", "https://ine.es/jaxi/files/_px/en/csv_bdsc/t35/p011/rev19/serie/l0/01001.csv_bdsc?nocab=1")
    .then(function (datos) {
    */
    
    console.log("Inicio de la actividad 1 - carga de datos");

    const datosOrdenados = ordenarDatos(datos);
    //    devuelveDatosOrdenados(datos, datosOrdenados)

    // Extrae valores únicos de los productos
    var productosUnicos = Array.from(new Set(datosOrdenados.map(d => d.Productos)));
    var periodosUnicos = Array.from(new Set(datosOrdenados.map(d => d.periodo)));
    var productoSeleccionado = "Todos los productos";
    var periodoSeleccionado = "Todos";

    // Agrega los títulos y subtítulos a la página
    d3.select("body").append("h1").text("Herramientas de visualización");
    d3.select("body").append("h2").text("Actividad 1 - Análisis tendencias en D3.js");
    
    console.log("Incluye los DIV para mostrar el cuadro y el gráfico")
    // Agrega un dic de cabecera donde se seleccionará el producto
    d3.select("body").append("div").attr("id", "seleccion").html("Gasto turístico receptor por productos y periodo: " + "<hr>")
        .style("width", "100%")
        .style("padding", "10px");
    // Agrega un div contenedor de la tabla y el gráfico
    d3.select("body").append("div").attr("id", "contenedor")
        .style("display", "flex")
        .style("width", "100%")
        .style("justify-content", "space-between");
    // Agrega un div donde se mostrará una tabla con la información del csv
    d3.select("#contenedor").append("div").attr("id", "cuadro").text("")
        .style("width", "48%")
        .style("padding", "10px");
    // Agrega un div al lado del anterior donde se mostrará la gráfica obtenida de la información del csv
    d3.select("#contenedor").append("div").attr("id", "grafico")
        .style("width", "48%")
        .style("padding", "10px");
    
    // Dentro del div de filtros agrega una tabla de 4 columnas, en cada columna estará las eetiquetas y select's
    d3.select("#seleccion").append("table").attr("id", "filtros");
    d3.select("#filtros").append("tr").attr("id", "filaFiltros");
    d3.select("#filaFiltros").append("td").attr("id", "cellEtiquetaFiltroPeriodo");
    d3.select("#filaFiltros").append("td").attr("id", "cellSeleccionFiltroPeriodo");
    d3.select("#filaFiltros").append("td").attr("id", "cellEtiquetaFiltroProducto");
    d3.select("#filaFiltros").append("td").attr("id", "cellSeleccionFiltroProducto");
    
    
    // Agrega un select de los periodos para que puede seleccionarse uno de ellos,
    //d3.select("#seleccion").append("p");
    d3.select("#cellEtiquetaFiltroPeriodo").append("label").text("Seleccione un periodo : ");
    d3.select("#cellSeleccionFiltroPeriodo").append("select").attr("id", "periodo");

    d3.select("#periodo")
        .selectAll("option")
        .data(periodosUnicos)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Agrega una opción para todos los periodos
    d3.select("#periodo")
        .append("option")
        .text("Todos")
        .attr("value", "Todos");

    // Asigna el valor "Todos" como valor por defecto
    d3.select("#periodo")
        .property("value", "Todos")
        .dispatch("change");
    
    // Agrega un select de los productos para que puede seleccionarse uno de ellos,
    // sobre el cual se  mostrará el cuadro y el gráfico, esto ser hará sobre el primer DIV de cabecera
    d3.select("#cellEtiquetaFiltroProducto").append("label").text("Seleccione un producto : ");
    
    // Agrega las opciones de productos sin que se repitan
    d3.select("#cellSeleccionFiltroProducto").append("select").attr("id", "producto")
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
    
    // Agrega la acción change al select de periodos, toma en consideración lo filtrado en el select de productos
    // según esto hará el cuadro y el gráfico
    d3.select("#periodo")
        .on("change", function () {
            console.log("selecciona un periodo");
            periodoSeleccionado = this.value;

            //* Asigna el título del DIV
            AsignaTitulo(productoSeleccionado, periodoSeleccionado);

            // Filtra el dataset según el producto seleccionado, es este nuevo dataset filtrado sobre el que se hace el cuadro y el gráficcc
            if (productoSeleccionado == "Todos los productos") {
                // En caso se haya seleccionado "Todos los Producctos" no hace filtro y envía todo
                if (periodoSeleccionado == "Todos") {
                    var datoFinal = datosOrdenados;
                } else {
                    var datoFinal = datosOrdenados.filter(d => d.periodo === periodoSeleccionado);
                }
            } else {
                if (periodoSeleccionado == "Todos") {
                    var datoFinal = datosOrdenados.filter(d => d.Productos === productoSeleccionado);
                } else {
                    var datoFinal = datosOrdenados.filter(d => d.Productos === productoSeleccionado && d.periodo === periodoSeleccionado);
                }
            }
            // Llama a la función para mostrar el cuadro
            MostrarCuadro(datoFinal);
            GraficoLineasProducto(datosOrdenados,productosUnicos);
        });


    // Agrega la acción change al select de productos, toma en consideración lo filtrado en el select de periodos
    // según esto hará el cuadro y el gráfico
    d3.select("#producto")
        .on("change", function () {
            console.log("selecciona un producto");
            productoSeleccionado = this.value;

            //* Asigna el título del DIV
            AsignaTitulo(productoSeleccionado, periodoSeleccionado);

            // Filtra el dataset según el producto seleccionado, es este nuevo dataset filtrado sobre el que se hace el cuadro y el gráficcc
            if (productoSeleccionado == "Todos los productos") {
                // En caso se haya seleccionado "Todos los Producctos" no hace filtro y envía todo
                if (periodoSeleccionado == "Todos") {
                    var datoFinal = datosOrdenados;
                } else {
                    var datoFinal = datosOrdenados.filter(d => d.periodo === periodoSeleccionado);
                }
            } else {
                if (periodoSeleccionado == "Todos") {
                    var datoFinal = datosOrdenados.filter(d => d.Productos === productoSeleccionado);
                } else {
                    var datoFinal = datosOrdenados.filter(d => d.Productos === productoSeleccionado && d.periodo === periodoSeleccionado);
                }
            }
            // Llama a la función para mostrar el cuadro
            MostrarCuadro(datoFinal);
            GraficoLineasProducto(datoFinal,productosUnicos);
        });

    periodoSeleccionado = "Todos";
    productoSeleccionado = "Todos los productos";
    // Establece un valor por defecto en el select de periodos
    d3.select("#periodo")
        .property("value", periodoSeleccionado)
        .dispatch("change");

    // Establece un valor por defecto en el select de productos
    d3.select("#producto")
        .property("value", productoSeleccionado)
        .dispatch("change");
});

function AsignaTitulo(productoSeleccionado, periodoSeleccionado) {
    const tituloCuadro = productoSeleccionado === "Todos los productos" && periodoSeleccionado === "Todos"
        ? "Gasto turístico receptor por producto entre los años 2016 al 2022"
        : productoSeleccionado !== "Todos los productos" && periodoSeleccionado === "Todos"
        ? `Gasto turístico receptor de ${productoSeleccionado} entre los años 2016 al 2022`
        : productoSeleccionado === "Todos los productos" && periodoSeleccionado !== "Todos"
        ? `Gasto turístico receptor en el periodo ${periodoSeleccionado} para todos los productos`
        : `Gasto turístico receptor de ${productoSeleccionado} en el periodo ${periodoSeleccionado}`;      
    
    d3.select("#cuadro").html(tituloCuadro + "<hr>");
}

// esta función muestra la tabla con el dataset según los filtros de los select
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

function GraficoLineasProducto(datos,productosUnicos) {
    // Hace un gráfico de líneas cuando se ha seleccionado todos los periodos y un solo producto
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const ancho = 450 - margin.left - margin.right;
    const alto = 400 - margin.top - margin.bottom;
    
    d3.select("#grafico").selectAll("*").remove();

    // agrupo los datos por producto para poder gráficar cada uno de ellos con un color diferente
    const datosPorProducto = d3.group(datos, d => d.Productos);
    // se define una escala de colores para cada producto
    // schemeObservable10 tomado de: https://d3js.org/d3-scale-chromatic/categorical
    const color = d3.scaleOrdinal()
    .domain(productosUnicos)
    .range(d3.schemeObservable10);
    
    // Escalas
    const escalaX = d3.scalePoint()
      .domain(datos.map(d => d.periodo)) // Asume que periodo es string tipo "2016T1"
      .range([0, ancho]);
    
    const escalaY = d3.scaleLinear()
      .domain([d3.min(datos, d => d.Total)-200, d3.max(datos, d => d.Total)+200])
      .range([alto, 0]);
    
    // Crear SVG con grupo interno con márgenes
    const svg = d3.select("#grafico")
      .append("svg")
      .attr("width", ancho + margin.left + margin.right + 200)
      .attr("height", alto + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Línea
    const linea = d3.line()
      .x(d => escalaX(d.periodo))
      .y(d => escalaY(d.Total));
    
    // Dibujar la línea
    /*svg.append("path")
      .datum(datos)
      .attr("d", linea)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);*/

    // Dibujar líneas para cada producto
      datosPorProducto.forEach((valores, producto) => {
        svg.append("path")
          .datum(valores)
          .attr("d", linea) 
          .attr("fill", "none")
          .attr("stroke", color(producto))
          .attr("stroke-width", 2);
      });
    // crear leyenda
    const leyenda = svg.append("g")
    .attr("transform", `translate(${ancho + 20}, 0)`);
    
    // muestra los productos con su color correspondiente
    productosUnicos.forEach((producto, i) => {
        const item = leyenda.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      
        item.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(producto));
      
        item.append("text")
          .attr("x", 10)
          .attr("y", 9)
          .text(producto)
          .style("font-size", "8px")
          .attr("fill", "black");
    });
    
    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${alto})`)
      .call(d3.axisBottom(escalaX));
    
    svg.append("g")
      .call(d3.axisLeft(escalaY));    

}

function ordenarDatos(datos) {
    // Paso 1: Limpiar los datos, eliminando las comas y convirtiendo a números
    const datosLimpios = datos.map(d => ({
        Productos: d.Productos,
        periodo: d.periodo,
        Total: parseFloat(d.Total.replace(/,/g, "")) // Reemplaza las comas y convierte a número
    }));

    // Paso 2: Agrupar los datos por producto utilizando d3.group()
    const datosPorProducto = d3.group(datosLimpios, d => d.Productos);

    // Paso 3: Ordenar los periodos dentro de cada grupo de producto (de menor a mayor)
    datosPorProducto.forEach((Productos, key) => {
        Productos.sort((a, b) => a.periodo - b.periodo); // Ordena por periodo dentro de cada producto
    });

    // Paso 4: Si prefieres un solo arreglo con todos los datos, aplana el grupo
    const datosOrdenados = Array.from(datosPorProducto.values()).flat();

    // Retorna el nuevo dataset ordenado
    return datosOrdenados;
}
 