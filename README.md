# Actividad 1 - Herramientas de visualización de datos

En el marco del desarrollo de la actividad 1 para la materia herramientas de visualización, se realiza un procesamiento de datos sobre el conjunto de registros que permite visualizar la cantidad de ventas que se realizaron en el sector turismo durante los años 2016 - 2022 para diferentes productos. Una vez realizado el tratamiento de datos correspondiente la información se almacena en un [archivo plano .csv, consultar aquí.](/source/data/01001.csv)

## Desarrollo de la actividad

Posteriormente, se dispone de una [página web](/index.html) (POR FAVOR TENER EN CUENTA LOS PASOS PARA VER LA PÁGINA EN LOCAL)donde se visualiza la información resumen identificada a partir de los datos ya tratados anteriormente y que están disponibles en el archivo .csv mencionado líneas atras, Donde se puede observar:

### Gráfico de Líneas - ventas por productos turísticos y años

1. A través de un gráfico de líneas, se puede observar la tendencia de ventas por producto entre los años 2016 - 2022, donde a nivel general, todos los productos tuvieron una caida en ventas en el año 2020:
![Gráfico de Líneas](/source/photo/Ventas_productos_year.png "Gráfico de Líneas")
Sin embargo, para el año 2021, todas las ventas tuvieron una recuperación en las ventas hasta que en el 2022 llegaron a obtener valores cercanos a lo registrado en el 2019.

2. La caida mostrada en el 2020 se dió principalmente por la declaratoria de emergencia sanitaria con el COVID19, que obligó al mundo a suspender las actividades presenciales en numerosas actividades por el cuidado personal de las personal ante la desprotección contra el virus.

3. En la tabla dispuesta en el aplicativo, se pueden consultar los valores a detalle en las ventas de cada producto por año:
![tabla de datos](/source/photo/tabla_productos.png)
Se agregaron filtros para que el usuario pueda analizar la información con mayor detalle dependiento del **periodo o año de venta** y el **producto vendido**.

4. El producto **Servicios de provisión de alimentos y bebidas** fue el que generó mayor número de ventas en el período analizado. Haciendo un enfasis en la revisión de la tendencia con la gráfica: ![Servicios de provisión de alimentos y bebidas](/source/photo/servicio_provi_aliment_bebidas.png)
Gracias a las estratégias de marketing derivadas, a pesar de la caida en el 2020, el equipo logró recuperar las ventas con los clientes tanto en 2021 cómo en 2022 siendo este último año el de mayor crecimiento, sobrepasando las ventas que se tenían en 2019 pre pandemía. 

5. El producto con menos ventas fue el de **servicio de transporte de pasajeros por agua** que aunque tenía unas ventas no mayores a 500 Euros pre pandemía, se redujo significativamente cerca de un 71% en el año 2020 por la emergencia de salud, llegando a un valor de ventas de 79 Euros. Gracias al levantamiento de las medidas sanitarias de restricción de confinamiento de las personas en casa y la estratégia de la compañia, durante los años 2021 y 2022, se lograron ventas por encima de los años pre pandemía logrando un aumento para 2022 de 463 Euros, cercano al 64% comparado con las ventas del año 2019. ![Servicios de transporte de pasajeros por agua](/source/photo/servicio_transporte_pasa_agua.png)

***NOTA:*** El gráfico de líneas se muestra cuando en el período el filtro está en **"Todos"**.

### Gráfico de Barras - ventas por productos turísticos y año

Finalmente, se agrega un gráfico de barras que permite ver el valor total de ventas de todos los productos por 1 año o periodo en específico. Para ver este gráfico se debe seleccional en el filtro de periodo, un valor diferente a **Todos**. 
![Gráfico de barras por producto - año 2019 pre pandemia](/source/photo/diagrama_barras_year.png)

Este informe se presenta complemento a los análisis detallados por la compañía según el usuario consultante.


## Pasos para implementar el proyecto en local

1. Clonar el repositorio en local con la función:
`git clone https://github.com/arodriguez2222/actividad1_hv.git`

2. Cambiar de rama a `git checkout pruebacarlos`

3. Ejecutar el archivo [index.html](index.html) con un navegador web o usando Visual Studio Code con la extensión Live Server.



## Soporte

Ante cualquier novedad, contactar con los desarrolladores de este trabajo:


- cesar fernando balaguer garcia
- mario alejandro rodriguez pachon
- sebastian david vargas munoz
- christian ferley flautero loaiza
- jairo moreno acevedo



***LINK REPOSITORIO:*** [https://github.com/arodriguez2222/actividad1_hv/tree/pruebacarlos](https://github.com/arodriguez2222/actividad1_hv/tree/pruebacarlos)



**Copyright 2025**