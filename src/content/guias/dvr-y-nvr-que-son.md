---
palabraClave: dvr y nvr
titulo: "DVR y NVR: diferencias, almacenamiento y compatibilidad"
tituloSeo: "DVR y NVR: diferencias y criterios para elegir"
descripcion: "Compara DVR y NVR según cámaras, cableado, almacenamiento y compatibilidad. Revisa PoE, acceso remoto y pruebas de grabación antes de contratar."
fecha: 2026-09-27
actualizado: 2026-11-22
autor: Equipo TuSeguridad
tags: ["guía", "cctv", "dvr", "nvr", "videovigilancia"]
rubros: ["cctv-videovigilancia"]
empresas: ["gupri-seguridad-privada"]
fuentes:
  - titulo: ONVIF, Profile T para transmisión avanzada de video
    url: https://www.onvif.org/profiles/profile-t/
  - titulo: ONVIF, base oficial de productos conformes
    url: https://www.onvif.org/conformant-products/
  - titulo: Axis Communications, documentación sobre codificadores de video
    url: https://whitepapers.axis.com/en-us/video-encoders
  - titulo: Ley Federal de Protección de Datos Personales en Posesión de los Particulares
    url: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
faq:
  - q: ¿Cuál es la diferencia principal entre DVR y NVR?
    a: En una arquitectura habitual, el DVR recibe video analógico compatible y lo digitaliza para grabarlo; el NVR recibe flujos digitales por una red. Los equipos híbridos deben revisarse por modelo.
  - q: ¿Un NVR necesita internet para grabar?
    a: La grabación local puede funcionar sin internet si mantiene alimentación y comunicación entre cámaras y grabador. Las funciones de nube, avisos y consulta externa pueden depender de internet.
  - q: ¿Todos los NVR alimentan cámaras por PoE?
    a: No. Algunos incorporan puertos PoE y otros requieren un switch o fuente compatible. Verifica estándar, potencia por puerto y presupuesto total para los dispositivos conectados.
  - q: ¿H.265 siempre permite guardar el doble de días?
    a: No existe esa proporción universal. La retención depende del flujo real, escena, ajustes, número de cámaras y espacio disponible. Compara una configuración representativa antes de comprometer días.
  - q: ¿Un logotipo ONVIF asegura todas las funciones?
    a: Revisa producto, versión y perfiles en la base oficial y prueba las funciones requeridas con el grabador concreto. Mostrar imagen no demuestra eventos, audio o reproducción compatibles.
  - q: ¿Cuántos días debo conservar las imágenes?
    a: Define el plazo por finalidad, riesgos y obligaciones aplicables. Dimensiona el almacenamiento conforme al plazo aprobado y comprueba la retención real; la capacidad del disco no fija la obligación legal.
  - q: ¿El monitoreo incluye instalar un grabador?
    a: No debe darse por hecho. Separa suministro, instalación, mantenimiento, almacenamiento y operación de alertas en la propuesta; cada concepto necesita alcance y responsable.
---

Elegir entre DVR y NVR requiere conocer las cámaras existentes, el cableado, la forma de consultar imágenes y el tiempo de conservación necesario. La sigla no determina por sí sola la calidad de la evidencia ni la disponibilidad del sistema.

Una compra útil termina con video recuperable y un procedimiento que la persona responsable sabe ejecutar. Esta guía organiza preguntas para cotizar y recibir el equipo; las capacidades deben contrastarse con el manual del modelo y pruebas en el inmueble.

## Qué es un DVR

DVR significa grabador de video digital. Recibe la señal de **cámaras analógicas** por cable coaxial, la convierte a video digital, la comprime y la guarda en un disco duro. Desde el mismo equipo se ve el video en un monitor y, con conexión a internet, desde el celular.

Hay DVR compatibles con formatos analógicos de alta definición, como TVI, CVI y AHD. Otros equipos, identificados como híbridos o XVR, pueden admitir cámaras IP. Revisa la combinación concreta de entradas, resoluciones y cuadros por segundo: el nombre comercial no demuestra todas esas capacidades.

## Qué es un NVR

NVR significa grabador de video en red. Trabaja con **cámaras IP**: cada cámara ya entrega video digital y el NVR lo recibe por la red, sea por cable o por wifi. Muchos NVR traen puertos PoE, que mandan datos y corriente por el mismo cable de red, así que cada cámara necesita un solo cable.

## DVR y NVR: decide a partir del inventario

| Situación | Lo más sensato |
|---|---|
| Ya hay cable coaxial tendido y en buen estado | DVR: reaprovechas el cableado |
| Instalación nueva | Comparar arquitecturas completas con los mismos objetivos |
| Necesitas leer placas o utilizar analítica | Revisar cámara, escena, procesamiento y compatibilidad específica |
| Presupuesto limitado | Comparar equipo, instalación, soporte y crecimiento del mismo alcance |
| Sistema mixto, cámaras viejas y nuevas | Grabador híbrido |

El inventario debe registrar modelos, estado del cable y finalidad de cada cámara. Cambiar arquitectura no corrige por sí mismo iluminación o encuadre. La [documentación de Axis sobre codificadores](https://whitepapers.axis.com/en-us/video-encoders) describe otra alternativa: incorporar señales analógicas a una red. Evalúa sus límites y costo sin asumir que migrar todo siempre sea necesario.

## Cuántas cámaras acepta

Los grabadores se venden por canales: 4, 8, 16, 32. Un canal es una cámara. Dos consejos que ahorran una segunda compra:

- Calcula una reserva según ampliaciones previstas. Dejar entradas libres no basta si faltarán potencia, almacenamiento o licencias.
- En un NVR revisa también el ancho de banda de entrada, no solo los canales. Dieciséis cámaras de alta resolución pueden rebasar lo que el equipo procesa aunque tenga dieciséis puertos.

## El disco duro

El disco guarda el video y define cuántos días de grabación tienes. Dos reglas:

**Que sea compatible con la carga prevista.** Revisa modelos admitidos por el grabador, capacidad, temperatura de operación y carga de trabajo del disco. Una denominación comercial de videovigilancia no evita consultar esas especificaciones.

**Que el tamaño se calcule.** El espacio depende del número de cámaras, flujo de datos, resolución, compresión y modo de grabación. H.265 puede ofrecer ventajas frente a H.264 en ciertas condiciones, pero no permite prometer un ahorro fijo. La página de [instalación de cámaras de seguridad](/servicios/instalacion-de-camaras-de-seguridad/) ayuda a delimitar lo que debe entregar el instalador.

La sobrescritura depende de la configuración: comprueba si el sistema reemplaza lo más antiguo, detiene grabación o emite avisos. Acordar días de conservación requiere documentar los supuestos y verificar el resultado cuando exista suficiente historial.

## Dónde va el grabador

Si el grabador queda al alcance de personas no autorizadas, pueden dañarlo, desconectarlo o retirarlo. Define quién tendrá acceso físico y cómo se registrarán intervenciones de mantenimiento. La protección debe contemplar ventilación y condiciones de operación del fabricante.

Evalúa un gabinete con acceso restringido y respaldo eléctrico dimensionado. Un servicio de nube puede añadir otra copia, pero exige revisar conectividad, retención, exportación y costos. El diseño debe explicar qué permanece disponible si falla cualquiera de esos componentes.

## Seguridad del propio equipo

Un grabador conectado a internet es una computadora expuesta:

- Cambia la contraseña de fábrica del grabador y de cada cámara el día de la instalación.
- Actualiza el firmware cuando el fabricante publique correcciones.
- Pide que el acceso remoto quede en una cuenta a tu nombre, no a nombre del técnico.

## PoE y energía: comprueba el recorrido completo

PoE permite transportar energía y datos por un cable Ethernet cuando los componentes son compatibles. Un puerto de red no necesariamente entrega energía. Algunos NVR incorporan puertos PoE y otros trabajan mediante un switch o una fuente externa. La propuesta debe indicar cómo se alimenta cada cámara y dónde se ubica la fuente.

Revisa la potencia disponible por puerto, el presupuesto total y la demanda máxima de los equipos conectados. Iluminadores, calefacción u otros accesorios pueden modificar el consumo. El cálculo debe utilizar especificaciones de los modelos elegidos y contemplar los modos de operación relevantes, incluidos los nocturnos.

Un no-break conectado únicamente al grabador puede dejar sin energía cámaras y switches. Dibuja el recorrido de alimentación y decide qué componentes deben continuar funcionando durante un corte. La autonomía se calcula con la carga concreta y se verifica mediante una prueba controlada; también debe existir un procedimiento de apagado y recuperación.

## Interoperabilidad: qué demuestra ONVIF

ONVIF define perfiles para funciones de sistemas de seguridad en red. [Profile T](https://www.onvif.org/profiles/profile-t/) incluye transmisión con formatos H.264 y H.265 y determinadas funciones asociadas. La referencia ayuda a precisar requisitos, pero una mención genérica en una caja no demuestra todas las capacidades necesarias.

Busca el modelo, versión y perfiles en la [base oficial de productos conformes](https://www.onvif.org/conformant-products/). Revisa tanto el dispositivo como el cliente que recibe la información. Que un fabricante sea miembro de la organización no convierte automáticamente todo su catálogo en productos conformes.

Prueba por separado imagen en vivo, grabación, reproducción, eventos, audio y movimiento PTZ cuando estén contratados. Documenta qué se logra mediante funciones comunes y qué requiere una integración particular. Recibir video no acredita por sí solo que lleguen alertas o que sea posible recuperar grabaciones desde otra aplicación.

## Estimación y comprobación de retención

Como cálculo ilustrativo, un flujo constante de 1 megabit por segundo genera aproximadamente 10.8 gigabytes decimales al día, sin considerar otros datos ni reservas. Multiplica por cámaras y días únicamente si ese flujo representa la operación real. La escena, los ajustes y la grabación por evento pueden modificar sustancialmente el resultado.

Solicita una hoja de cálculo con flujo previsto por cámara, horario, espacio utilizable y margen para variaciones. Distingue la capacidad instalada de la disponible después de configuración y reservas del sistema. No conviertas una estimación de laboratorio en una promesa contractual sin explicar las condiciones.

Cuando exista historial suficiente, busca la grabación más antigua y compárala con el plazo acordado. Repite esa revisión después de agregar cámaras o cambiar calidad. Si falta video, investiga si se debe a sobrescritura, disco, horario de grabación o pérdida del enlace; ampliar capacidad no resuelve todas esas causas.

## Preguntas para quien te lo va a instalar

Antes de recibir propuestas, define quién administra el sistema y qué puede hacer cada usuario. La persona que consulta imágenes no necesita necesariamente permiso para borrar información o modificar la red. Conserva medios institucionales de recuperación de cuentas y acuerda cómo se revocan accesos al cambiar de técnico o de personal.

Pide la política de actualizaciones y el periodo de soporte del modelo. Para una actualización, conserva configuración por el mecanismo previsto, revisa compatibilidad y acuerda una ventana de mantenimiento. Después comprueba que todas las cámaras siguen grabando y que las cuentas autorizadas pueden recuperar video.

1. ¿DVR, NVR o híbrido, y por qué para mi predio?
2. ¿Cuántos canales, cuántos quedan libres?
3. ¿Qué disco, de qué capacidad y cuántos días de grabación me da?
4. ¿Dónde lo van a colocar y con qué respaldo eléctrico?
5. ¿Cómo exporto un video si lo necesito para una denuncia?

## Privacidad y exportación antes de una incidencia

En una instalación que trata datos personales, la conservación debe responder a una finalidad definida. La [ley federal aplicable a particulares](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf), publicada en 2025 y con reforma indicada del 14 de noviembre de ese año, es la referencia jurídica consultada. La capacidad máxima del disco no fija por sí misma cuánto tiempo debes conservar imágenes.

Establece quién autoriza una extracción, qué segmento se entrega y cómo se registra la solicitud. Conserva el formato original disponible y comprueba que pueda reproducirse en el entorno del destinatario autorizado. Anotar cámara, intervalo, zona horaria y persona que realizó la extracción ayuda a interpretar la información; su valor probatorio depende del caso y del procedimiento aplicable.

Practica con un evento de prueba antes de que ocurra un incidente. Una fotografía de la pantalla no equivale al archivo grabado. La mensajería puede modificar el video o ampliar indebidamente su distribución, por lo que debes utilizar el medio de entrega autorizado y conservar constancia del destinatario.

## Recibe el sistema con pruebas observables

Relaciona cada entregable de la propuesta con una comprobación: inventario, cámaras activas, reproducción, exportación y atención de errores. Realiza una pérdida controlada de internet para saber qué funciones locales continúan y cuáles dependen de servicios externos. Evita interrumpir la operación sin coordinación con la administración.

Registra pendientes con responsable y fecha de corrección. Un monitor con imágenes en vivo no demuestra que el historial se esté guardando. Verifica también que el reloj y la zona horaria permitan relacionar la grabación con las bitácoras del inmueble.

Si se contrata operación además de equipo, la [ficha de GUPRI Seguridad Privada](/categorias/seguridad-privada/cdmx/gupri-seguridad-privada/) enlaza su servicio declarado de [monitoreo CCTV](/categorias/seguridad-privada/cdmx/gupri-seguridad-privada/monitoreo-cctv/). Úsalo para preguntar por revisión de grabaciones y atención de fallas; estos enlaces no acreditan instalación, compatibilidad o calidad del proveedor.

Si todavía no decides qué cámaras poner, la guía de [tipos de cámaras de seguridad](/guias/tipos-de-camaras-de-seguridad/) ordena las opciones por punto del predio. Los instaladores por estado están en el rubro de [CCTV y videovigilancia](/categorias/cctv-videovigilancia/).

> TuSeguridad es un directorio y no vende ni instala equipo de videovigilancia. Esta guía explica equipo de uso común; capacidades y especificaciones exactas dependen de cada fabricante y modelo.
