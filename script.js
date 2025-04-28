
d3.dsv(";", "01001.csv").then(function (datos) {

    //lineas de código para importar datos desde la web.
    //d3.dsv(";", "https://ine.es/jaxi/files/_px/en/csv_bdsc/t35/p011/rev19/serie/l0/01001.csv_bdsc?nocab=1").then(function (datos) {
    
    console.log("Inicio de la actividad 1 - carga de datos");

    // crea 2 variables, una que tendrá el producto seleccionado y otra con el periodo seleccionado, le asina valores default
    var productoSeleccionado = "Todos los productos";
    var periodoSeleccionado = "Todos";
    
    // llama a función que devuelve los datos ordenados, el orden lo hace por producto y dentro de este por periodo
    var datosOrdenados = ordenarDatos(datos);

    // Extrae valores únicos de los productos
    var productosUnicos = Array.from(new Set(datosOrdenados.map(d => d.Productos)));
    var periodosUnicos = Array.from(new Set(datosOrdenados.map(d => d.periodo)));

    // Agrega los títulos y subtítulos a la página
    console.log("Incluye el título y subtítulo de la página")
    creaTituloPagina();

    // Agrega un div contenedor de la tabla y el gráfico
    console.log("Incluye los DIV para mostrar el cuadro y el gráfico")
    CreaDivisiones();    
    
    // Dentro del div de filtros agrega una tabla de 4 columnas, en cada columna estará las eetiquetas y select's
    console.log("Crea la tabla donde se mostrarán los filtros")
    creaTablaFiltros();    
    
    // Crea los combos con ls filtros por periodo y por producto
    console.log("Crea los filtros dentro de la tabla de filtros")
    creaEtiquetasFiltros();
    creaSelectFiltros(periodosUnicos, productosUnicos);

    // Establece valores por defecto al select de periodos y productos
    periodoSeleccionado = "Todos";
    productoSeleccionado = "Todos los productos";


    // Agrega la acción change al select de prouctos, toma en consideración lo filtrado en el select de productos
    // según esto hará el cuadro y el gráfico
    creaEventoOnChangeProducto(datosOrdenados, periodoSeleccionado, productoSeleccionado);

    // Agrega la acción change al select de periodos, toma en consideración lo filtrado en el select de periodos
    // según esto hará el cuadro y el gráfico
    creaEventoOnChangePeriodo(datosOrdenados, periodoSeleccionado, productoSeleccionado);


    console.log("asigna el change al producto")
    console.log("asigla el change al periodo")

    d3.select("#periodo")
        .property("value", periodoSeleccionado)
        .dispatch("change");

    d3.select("#producto")
        .property("value", productoSeleccionado)
        .dispatch("change")
    
    
    console.group("Termina el código");
});

function AsignaTituloCuadro(productoSeleccionado, periodoSeleccionado) {
    const tituloCuadro = productoSeleccionado === "Todos los productos" && periodoSeleccionado === "Todos"
        ? "Gasto turístico receptor por producto entre los años 2016 al 2022"
        : productoSeleccionado !== "Todos los productos" && periodoSeleccionado === "Todos"
        ? `Gasto turístico receptor de ${limpiarDescripcion(productoSeleccionado)} entre los años 2016 al 2022`
        : productoSeleccionado === "Todos los productos" && periodoSeleccionado !== "Todos"
        ? `Gasto turístico receptor en el periodo ${periodoSeleccionado} para todos los productos`
        : `Gasto turístico receptor de ${limpiarDescripcion(productoSeleccionado)} en el periodo ${periodoSeleccionado}`;      
    
    //d3.select("#tituloCuadro").html(tituloCuadro + "<hr>");
    d3.select("#tituloCuadro").text(tituloCuadro)
}

function AsignaTituloGrafico(productoSeleccionado, periodoSeleccionado) {
    const tituloGrafico = productoSeleccionado === "Todos los productos" && periodoSeleccionado === "Todos"
        ? "Evolución del gasto turístico receptor por producto entre los años 2016 al 2022"
        : productoSeleccionado !== "Todos los productos" && periodoSeleccionado === "Todos"
        ? `Evolución del gasto turístico receptor de ${limpiarDescripcion(productoSeleccionado)} entre los años 2016 al 2022`
        : productoSeleccionado === "Todos los productos" && periodoSeleccionado !== "Todos"
        ? `Evolución del gasto turístico receptor en el periodo ${periodoSeleccionado} para todos los productos`
        : `Evolución del gasto turístico receptor de ${limpiarDescripcion(productoSeleccionado)} en el periodo ${periodoSeleccionado}`;      
    
    d3.select("#tituloGrafico").text(tituloGrafico)    
}

// esta función muestra la tabla mostrando la información del dataset según los filtros seleccionados
function mostrarCuadroDatos(datos) {
    // Crea la variable cuadro, con la selección del DIV con el mismo nombre
    var cuadro = d3.select("#cuadro");
    // Selecciona la tabla existente en el DIV
    tabla = cuadro.select("#tabla")
    if (tabla.empty()) {
        // En caso no exista crea la tabla y la cabecera de la tabla
        tabla = cuadro.append("table").attr("id", "tabla");

        // Crea el encabezado de la tabla (fila con los títulos)
        var RowEncabezado = d3.select("#tabla");
        RowEncabezado.append("thead").attr("id", "encabezado").append("tr").attr("id", "FilaPrincipal");

        // Crea las columnas del encabezado
        creaTituloCuadroDatos();

    }
    
    // Crea variable con cuerpo de la tabla, en caso esté vacía la crea en la tabla, en caso contrario las elimina
    var contenido = tabla.select("tbody");
    if (contenido.empty()) {
        contenido = tabla.append("tbody").attr("id", "contenido");
    } else {
        contenido.selectAll("tr").remove();
    }
    
    // Agrega filas a la tabla
    var filas = contenido.selectAll("tr")
        .data(datos)
        .enter()
        .append("tr");
    
    // Agrega las columnas de la tabla utilizando la data filtrada recibida en la función
    // Para el periodo utiliza únicamente los 4 primeros caracteres para tener el año
    filas.selectAll("td")
        .data(d => [limpiarDescripcion(d.Productos), d.periodo.substring(0, 4), d.Total])
        .enter()
        .append("td")
        .text(d => d)
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "11px")
        .style("width", function (d, i) {
            // Fijar ancho de columnas individuales
            if (i === 0) return "600px";  // Primer columna "Producto" fija a 150px
            if (i === 1) return "150px";  // Segunda columna "Descripción" fija a 650px
            if (i === 2) return "150px";  // Segunda columna "Descripción" fija a 650px
        })
        .style("text-align", function(d, i) {
            if (i === 1) return "center"; // Alinea la segunda columna al centro
            if (i === 2) return "right";  // Alinea la última columna a la derecha
            return "left";  // Resto de las columnas a la izquierda por defecto
        });
    
    tabla.selectAll("tr:nth-child(odd)")
        .style("background-color", "#f2f2f2");
    
    d3.select("#etiquetaFuenteCuadro").remove();
    d3.select("#cuadro")
        .append("label")
        .attr("id", "etiquetaFuenteCuadro")
        .text("Fuente: INE - Instituto Nacional de Estadística")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "10px");

}

function creaGraficoLineasProducto(datos) {
    const margin = { top: 20, right: 30, bottom: 200, left: 60 };
    const ancho = 600 - margin.left - margin.right;
    const alto = 550 - margin.top - margin.bottom;

    d3.select("#graficoLinea").remove();
    d3.select("#graficoBarras").remove();

    // Agrupar datos por producto
    const datosPorProducto = d3.groups(datos, d => d.Productos); // Asume que hay un campo 'Producto'

    // Escalas
    const escalaX = d3.scalePoint()
      .domain([...new Set(datos.map(d => d.periodo))])
      .range([0, ancho]);

    const escalaY = d3.scaleLinear()
      .domain([
        d3.min(datos, d => d.Total) - 200,
        d3.max(datos, d => d.Total) + 200
      ])
      .range([alto, 0]);

    // Escala de colores para los productos
    const colorLinea = d3.scaleOrdinal()
      .domain(datosPorProducto.map(d => d[0])) // Nombres de los productos
      .range(d3.schemeCategory10); // Paleta de 10 colores estándar (puedo pasarte otras más pro si quieres)

    // Crear SVG
    const svg = d3.select("#grafico")
        .append("svg")
        .attr("id", "graficoLinea")
        .attr("width", ancho + margin.left + margin.right)
        .attr("height", alto + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Definir la línea
    const linea = d3.line()
      .x(d => escalaX(d.periodo))
      .y(d => escalaY(d.Total));

    // Dibujar una línea por producto
    datosPorProducto.forEach(([producto, valores]) => {
        svg.append("path")
          .datum(valores)
          .attr("fill", "none")
          .attr("stroke", colorLinea(producto))
          .attr("stroke-width", 1)
          .attr("d", linea);
    });

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${alto})`)
      .call(d3.axisBottom(escalaX));

    svg.append("g")
      .call(d3.axisLeft(escalaY));

    const columnas = 2;  // Número de columnas
    const itemWidth = 280;  // Ancho de cada ítem de leyenda
    const itemHeight = 20;  // Altura de cada ítem de leyenda

    const leyenda = svg.append("g")
        .attr("transform", `translate(0, ${alto + margin.bottom - 150})`);

    leyenda.selectAll("g")
        .data(datosPorProducto)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
            const columna = i % columnas;  // Determina la columna
            const fila = Math.floor(i / columnas);  // Determina la fila
            return `translate(${columna * itemWidth}, ${fila * itemHeight})`;
        })
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => colorLinea(d[0]));

    leyenda.selectAll("g")
        .append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text(d => limpiarDescripcion(d[0]))  // Usando el nombre del producto como texto
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "10px");
    
    d3.select("#etiquetaFuenteGrafico").remove();
    d3.select("#grafico")
        .append("label")
        .attr("id", "etiquetaFuenteGrafico")
        .text("Fuente: INE - Instituto Nacional de Estadística")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "10px");    
}

function creaGraficoBarrasProducto(datos) {
    const margin = { top: 20, right: 30, bottom: 200, left: 60 };
    const ancho = 600 - margin.left - margin.right;
    const alto = 550 - margin.top - margin.bottom;

    d3.select("#graficoBarras").remove();
    d3.select("#graficoLinea").remove();

    // Agrupar datos por producto
    const datosPorProducto = d3.groups(datos, d => d.Productos); 

    // Escalas
    const escalaX = d3.scaleBand()
      .domain(datos.map(d => d.Productos))  // Asumiendo que hay un campo 'Producto'
      .range([0, ancho])
      .padding(0.1);  // Espaciado entre las barras
    
    const escalaY = d3.scaleLinear()
      .domain([0, d3.max(datos, d => d.Total) + 200])  // Rango del eje Y
      .range([alto, 0]);  // El alto se invierte para que las barras crezcan hacia abajo

    // Escala de colores para los productos
    const colorLinea = d3.scaleOrdinal()
      .domain(datosPorProducto.map(d => d[0])) // Nombres de los productos
      .range(d3.schemeCategory10); // Paleta de colores estándar

    // Crear SVG
    const svg = d3.select("#grafico")
        .append("svg")
        .attr("id", "graficoBarras")
        .attr("width", ancho + margin.left + margin.right)
        .attr("height", alto + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Dibujar las barras
    svg.selectAll(".bar")
        .data(datos)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => escalaX(d.Productos))  // Posición X de cada barra
        .attr("y", d => escalaY(d.Total))  // Posición Y de la barra
        .attr("width", escalaX.bandwidth())  // Ancho de las barras
        .attr("height", d => alto - escalaY(d.Total))  // Alto de la barra
        .attr("fill", d => colorLinea(d.Productos));  // Color de la barra

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${alto})`)
      .call(d3.axisBottom(escalaX))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "1px");

    svg.append("g")
      .call(d3.axisLeft(escalaY))
      .style("font-size", "12px");

    // Leyenda debajo del gráfico
    const leyenda = svg.append("g")
        .attr("transform", `translate(0, ${alto + 20})`);  // Aseguramos que la leyenda esté debajo

    const columnas = 2;  // Número de columnas
    const itemWidth = 280;  // Ancho de cada ítem de leyenda
    const itemHeight = 20;  // Altura de cada ítem de leyenda

    leyenda.selectAll("g")
        .data(datosPorProducto)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
            const columna = i % columnas;  // Determina la columna
            const fila = Math.floor(i / columnas);  // Determina la fila
            return `translate(${columna * itemWidth}, ${fila * itemHeight})`;
            return `translate(${columna * itemWidth}, ${fila * itemHeight})`;
        })
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => colorLinea(d[0]));

    leyenda.selectAll("g")
        .append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text(d => d[0])  // Usando el nombre del producto como texto
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px");

    d3.select("#etiquetaFuenteGrafico").remove();
    d3.select("#grafico")
        .append("label")
        .attr("id", "etiquetaFuenteGrafico")
        .text("Fuente: INE - Instituto Nacional de Estadística")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "10px");    
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
 
function creaTituloPagina() {
    // título de la página
    d3.select("body")
    .append("h1")
    .text("Herramientas de visualización")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "36px")
    .style("color", "#333")
    .style("text-align", "center")
        .style("margin-bottom", "10px");    
    
    //subtítulo de la página
    d3.select("body")
    .append("h2")
    .text("Actividad 1 - Análisis de tendencias en D3.js")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "24px")
    .style("color", "#666")
    .style("text-align", "center")
    .style("margin-top", "0px")
    .style("margin-bottom", "40px");    
}

function CreaDivisiones() {
    // Crea la división principal en la parte superior, debájo de los títulos, en este div irán los filtros para
    // que se muestre el cuadro al lado iquierdo y luego un gráfico al lado derecho.
    d3.select("body")
        .append("div")
        .attr("id", "seleccion")
        .style("width", "100%")
        .style("padding", "20px")
        .style("background-color", "#f5f7fa")
        .style("border-radius", "10px")
        .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.1)")
        .style("font-family", "Roboto, sans-serif")
        .style("margin-bottom", "20px");
        //.html('<div style="font-size:20px; font-weight:bold;">Gasto turístico receptor por productos y periodo:</div><hr>')
      
    // Div que será el principal, detro de este se crean 2 contenedores que serviran para pintal el cuadro y el gráfico
    d3.select("body")
        .append("div")
        .attr("id", "contenedor")
        .style("display", "flex")
        .style("gap", "20px")
        .style("width", "100%")
        .style("padding", "20px")
        .style("box-sizing", "border-box") 
        .style("font-family", "Roboto, sans-serif");

        d3.select("#contenedor")
        .append("div")
        .attr("id", "cuadro")
        .text("") 
        .style("width", "48%")
        .style("padding", "10px")
        .style("flex", "1")
        .style("background", "white")
        .style("box-shadow", "0 4px 10px gba(0,0,0,0.05)")
        .style("min-height", "400px")
        .style("font-size", "16px") 
        .style("overflow-y", "auto") 
        .style("max-height", "500px");
    
    // División donde estará el gráfico
    d3.select("#contenedor")
        .append("div")
        .attr("id", "grafico")
        .style("flex", "1")
        .style("background", "white")
        .style("padding", "20px")
        .style("border-radius", "12px")
        .style("box-shadow", "0 4px 10px rgba(0,0,0,0.05)")
        .style("min-height", "400px")
        .style("overflow-y", "auto") 
        .style("max-height", "500px");
    
    d3.select("#cuadro").append("label")
        .attr("id", "tituloCuadro")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("color", "#333")
        .style("display", "block")
        .style("margin-bottom", "8px")
        .style("text-align", "center");

    d3.select("#grafico").append("label")
        .attr("id", "tituloGrafico")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("color", "#333")
        .style("display", "block")
        .style("margin-bottom", "8px")
        .style("text-align", "center");

}

function creaTablaFiltros() {
    d3.select("#seleccion").append("table").attr("id", "filtros");
    d3.select("#filtros").append("tr").attr("id", "filaFiltros");
    d3.select("#filaFiltros").append("td").attr("id", "cellEtiquetaFiltroPeriodo");
    d3.select("#filaFiltros").append("td").attr("id", "cellSeleccionFiltroPeriodo");
    d3.select("#filaFiltros").append("td").attr("id", "cellEtiquetaFiltroProducto");
    d3.select("#filaFiltros").append("td").attr("id", "cellSeleccionFiltroProducto");    
}

function creaEtiquetasFiltros() {
    d3.select("#cellEtiquetaFiltroPeriodo").append("label")
        .text("Seleccione un periodo : ")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("color", "#333")
        .style("display", "block");

    d3.select("#cellEtiquetaFiltroProducto").append("label")
        .text("Seleccione un producto : ")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("color", "#333")
        .style("display", "block")
}

function creaSelectFiltros(periodosUnicos, productosUnicos) {
    // Agrega el select para los periodos y le añade la opción "Todos" para referir a todos los periodos
    // asignando este valor como default
    const TodosLosPeriodos = "Todos";
    const TodosLosProductos = "Todos los productos";

    d3.select("#cellSeleccionFiltroPeriodo").append("select").attr("id", "periodo")
    d3.select("#periodo")
        .selectAll("option")
        .data(periodosUnicos)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
    d3.select("#periodo")
        .append("option")
        .text(TodosLosPeriodos)
        .attr("value", TodosLosPeriodos);
    d3.select("#periodo")
        .property("value", TodosLosPeriodos)
        .dispatch("change");
    d3.select("#periodo")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("color", "#555");    

    // Agrega el select para los productos y le añade la opción "Todos los productos"
    // asignando este valor como default
    d3.select("#cellSeleccionFiltroProducto").append("select").attr("id", "producto")
        .selectAll("option")
        .data(productosUnicos)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => limpiarDescripcion(d));
    d3.select("#producto")
        .append("option")
        .text(TodosLosProductos)
        .attr("value", TodosLosProductos);
    d3.select("#producto")
        .property("value", TodosLosProductos)
        .dispatch("change");
    d3.select("#producto")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("color", "#555");       
}

function creaTituloCuadroDatos() {
    d3.select("#FilaPrincipal").append("th")
        .text("Producto")
        .style("background-color", "#3498db")
        .style("color", "white")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "400")
        .style("text-align", "left");
    d3.select("#FilaPrincipal").append("th")
        .text("Periodo")
        .style("background-color", "#3498db")
        .style("color", "white")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "400")
        .style("text-align", "center");
    d3.select("#FilaPrincipal").append("th")
        .text("Total")
        .style("background-color", "#3498db")
        .style("color", "white")
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "400")
        .style("text-align", "right");
}

function limpiarDescripcion(descripcion) {
    // Usamos una expresión regular para eliminar los caracteres al inicio antes de los dos puntos ":"
    return descripcion.replace(/^[^:]*:/, '').trim();  // Elimina todo lo que está antes de los dos puntos (incluyendo los dos puntos)
}

function creaEventoOnChangePeriodo(datosOrdenados, periodoSeleccionado, productoSeleccionado){
    d3.select("#periodo")
        .on("change", function () {
            console.log("#change periodo - periodo seleccionado");
            periodoSeleccionado = this.value;

            console.log("#change periodo - producto seleccionado")
            productoSeleccionado = d3.select("#producto").property("value");
            
            //* Asigna el título del DIV
            console.log("#change periodo - asigna títulos al cuadro y al gráfico")
            AsignaTituloCuadro(productoSeleccionado, periodoSeleccionado);
            AsignaTituloGrafico(productoSeleccionado, periodoSeleccionado);

            // Filtra el dataset según el producto seleccionado, es este nuevo dataset filtrado sobre el que se hace el cuadro y el gráficcc
            console.log("#change periodo - filtra dataset")
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
            console.log("#change periodo - muestra el dataset en un tabla")
            mostrarCuadroDatos(datoFinal);

            // Llama a la función para mostrar el gráfico
            if (periodoSeleccionado === "Todos") {
                console.log("#change periodo - muestra el gráfico de líneas")
                creaGraficoLineasProducto(datoFinal);
            } else {
                console.log("#change periodo - muestra el gráfico de barras")
                creaGraficoBarrasProducto(datoFinal);
            }
        });
    
}

function creaEventoOnChangeProducto(datosOrdenados, periodoSeleccionado, productoSeleccionado) {
    d3.select("#producto")
        .on("change", function () {

            console.log("#change producto - producto seleccionado");
            productoSeleccionado = this.value;

            console.log("#change producto - periodo seleccionado")
            periodoSeleccionado = d3.select("#periodo").property("value");

            //* Asigna el título del DIV
            console.log("#change producto - asigna títulos al cuadro y al gráfico")
            AsignaTituloCuadro(productoSeleccionado, periodoSeleccionado);
            AsignaTituloGrafico(productoSeleccionado, periodoSeleccionado);

            // Filtra el dataset según el producto seleccionado, es este nuevo dataset filtrado sobre el que se hace el cuadro y el gráficcc
            console.log("#change producto - filtra dataset")
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
            console.log("#change producto - muestra el dataset en un table")
            mostrarCuadroDatos(datoFinal);

            // Llama a la función para mostrar el gráfico
            if (periodoSeleccionado === "Todos") {
                console.log("#change producto - muestra el gráfico de líneas")
                creaGraficoLineasProducto(datoFinal);
            } else {
                console.log("#change producto - muestra el gráfico de barras")
                creaGraficoBarrasProducto(datoFinal);
            }
        });
    
}   