/* Contenido del escape room "Tu primer sueldo".
   Todo el texto visible, las respuestas, las pistas y los errores esperados se editan acá.
   Las salas de este archivo son la versión inicial; las versiones intermedia y avanzada y las
   palabras de la puerta final están en data/escape-versiones.js.
   Reglas de estilo: voseo, sin rayas largas y "|" como separador en títulos.
   Todos los montos, tasas y datos son ficticios. */
window.ESC_DATA = {
  titulo: "Tu primer sueldo",
  kicker: "Escape room de finanzas",
  historia: [
    "Es tu primer día de cobro. Fuiste a la empresa a firmar el recibo y la puerta de la oficina se trabó.",
    "Para salir tenés que abrir 5 candados, uno por sala. Cada candado que abrís te da letras del código de la puerta final."
  ],
  datos_juego: [
    { titulo: "5 salas", texto: "Se abren en orden. Cada una tiene tres versiones y podés volver a jugarla para ganar insignias." },
    { titulo: "Sin límite de tiempo", texto: "No hay cuenta regresiva ni forma de perder." },
    { titulo: "Pistas a cambio de llaves", texto: "Empezás con 3 y ganás una por cada reflexión." }
  ],

  /* Personaje: Fuerte, la caja fuerte de tu primer sueldo. Tiene 5 luces, una por candado */
  personaje: {
    nombre: "Fuerte",
    saludo: "¡Hola! Soy Fuerte, la caja fuerte de tu primer sueldo. Cada candado que abras enciende una de mis luces.",
    error: "Uy, casi. Fijate lo que dice abajo.",
    pista: "Te paso una ayuda.",
    festejo: "¡Se encendió otra luz!",
    mensaje: "Cada candado que abras enciende una de mis luces."
  },
  /* Niveles de Fuerte: uno por cada sala resuelta (0 a 5). Son hábitos, no categorías de tarjeta:
     la Sala 3 enseña a desconfiar de la tarjeta, así que el premio no es "subir de tarjeta". */
  niveles: ["Inicio", "Claridad", "Orden", "Prudencia", "Previsión", "Seguridad"],

  /* Modo simple (?modo=simple): mismas preguntas sin la capa de juego */
  simple: {
    titulo: "Finanzas personales | Cuestionario",
    intro: "Cinco preguntas sobre tu primer sueldo: el recibo, el presupuesto, la tarjeta, la inflación y las estafas digitales. Sin límite de tiempo.",
    pregunta: "Pregunta {n} de {t}",
    datos: "Datos para responder",
    siguiente: "Siguiente pregunta",
    terminar: "Terminar",
    repasar: "Repasar la pregunta"
  },

  autoeval: {
    titulo_pre: "Antes de entrar | ¿Cómo llegás?",
    intro_pre: "Marcá qué tan de acuerdo estás con cada frase. No hay respuestas correctas: es para que veas cuánto aprendiste al final.",
    titulo_post: "Antes de salir | ¿Cómo te vas?",
    intro_post: "Las mismas frases del principio. Respondé pensando en lo que sabés ahora.",
    escala: ["Para nada", "Poco", "Bastante", "Totalmente"],
    afirmaciones: [
      "Sé diferenciar sueldo bruto y neto.",
      "Puedo armar un presupuesto mensual simple.",
      "Entiendo qué pasa si pago el mínimo de la tarjeta.",
      "Sé por qué con inflación conviene que el ahorro no quede quieto.",
      "Reconozco un intento de estafa digital."
    ],
    boton_pre: "Entrar a la oficina",
    boton_pre_simple: "Empezar el cuestionario",
    boton_post: "Ver mi resultado",
    falta: "Te falta responder alguna frase."
  },

  puerta: {
    titulo: "La puerta final",
    texto: "Juntaste todas las letras. Ordenalas para responder la pregunta y abrir la puerta.",
    /* La pregunta y la palabra cambian en cada partida: están en data/escape-versiones.js */
    ayuda: "Una palabra de {n} letras, con las letras que juntaste.",
    anagrama: "Usaste todas las letras, pero esa palabra no responde la pregunta.",
    generico: "Todavía no. Probá ordenar las letras de otra manera.",
    falta: "Todavía te faltan letras. Resolvé las salas que quedan para abrir la puerta.",
    abierta: "¡La puerta se abrió!",
    boton: "Abrir la puerta"
  },

  saliste: {
    titulo: "¡Saliste!",
    sub: "Abriste la puerta final y Fuerte encendió sus cinco luces.",
    sub_simple: "Terminaste el cuestionario.",
    sello: "Tu sello",
    pistas_usadas: "Pistas usadas",
    salas: "Salas resueltas",
    tiempo: "Tiempo",
    antes_despues: "Antes y después",
    antes: "Antes",
    despues: "Después",
    tabla: "Ver los datos en una tabla",
    fortaleza: "Tu fortaleza",
    fortaleza_sube: "Es la frase que más subió.",
    fortaleza_firme: "Es tu frase con el puntaje más alto.",
    proximo: "Tu próximo paso",
    proximo_txt: "Es la frase con el puntaje más bajo. Repasá esa parte.",
    parejas_t: "Tus frases",
    parejas: "Tus cinco frases quedaron parejas. Elegí la sala que más te costó y repasala.",
    repasar: "Repasar la sala",
    codigo_t: "Tu código de resultado",
    codigo_ayuda: "Copialo y pegalo en el formulario de cierre que te pase tu docente.",
    copiar: "Copiar código",
    copiado: "Código copiado",
    volver: "Volver a jugar",
    volver_confirmar: "¿Seguro? Empezás una partida nueva, con otras versiones de las salas. Tus insignias se conservan."
  },

  textos: {
    inspeccionar: "Inspeccioná los objetos",
    cerrar: "Cerrar",
    probar: "Probar",
    vacio: "Escribí una respuesta antes de probar.",
    vacio_seleccion: "Marcá al menos un mensaje antes de probar.",
    generico: "Todavía no. Volvé a mirar los objetos de la sala.",
    correcto: "¡Abriste el candado!",
    correcto_simple: "¡Correcto!",
    intentos: "Intentos",
    pistas_titulo: "Pistas",
    pista: "Pista",
    ver_pista: "Ver pista",
    llave: "llave",
    llaves: "llaves",
    gratis: "gratis",
    pista_gratis: "Te destrabamos la próxima pista, gratis.",
    sin_llaves: "No te quedan llaves. Ganás una con cada reflexión, y si fallás 3 veces seguidas la próxima pista se abre sola.",
    candado_apagado: "Primero completá el desafío de arriba para encender el candado.",
    debrief_titulo: "Lo que acabás de resolver",
    extra_titulo: "Una pregunta más",
    extra_boton: "Responder",
    reflexion_titulo: "Para pensar",
    reflexion_ayuda: "Es opcional y no se corrige. Si escribís algo, ganás una llave.",
    reflexion_ayuda_simple: "Es opcional y no se corrige.",
    reflexion_boton: "Guardar reflexión",
    reflexion_ok: "Reflexión guardada. Ganaste una llave.",
    reflexion_guardada: "Reflexión guardada.",
    fragmento: "Letra del código",
    fragmento_2: "Letras del código",
    seguir: "Seguir a la sala",
    a_la_puerta: "Ir a la puerta final",
    tiempo_mostrar: "Mostrar tiempo",
    tiempo_ocultar: "Ocultar tiempo",
    resuelta: "resuelta",
    bloqueada: "bloqueada",
    actual: "actual",
    volver_taller: "Volver al taller",
    reiniciar: "Empezar de cero",
    recorrido: "Tu recorrido",
    panel: "Panel",
    salas_t: "Salas",
    codigo_t: "Código de la puerta",
    codigo_txt: "Juntá las letras de las 5 salas para abrir la puerta final.",
    codigo_listo: "¡Tenés todas las letras! Ya podés ir a la puerta final.",
    pistas_usadas: "Pistas usadas",
    llaves_extra: "+1 por reflexión",
    nivel: "Nivel",
    proximo_nivel: "Abrí un candado más para subir a {n}.",
    nivel_max: "Llegaste al nivel más alto.",
    subiste: "Nuevo nivel: {n}",
    tu_avance: "Tu avance",
    luces_encendidas: "luces encendidas",
    luz_de: "Luz de",
    luz_enciende: "Al abrir este candado, {p} enciende la luz de",
    luz_encendida: "Candado abierto: {p} encendió la luz de",
    entrar: "Entrar a la sala",
    sala_de: "Sala {n} de {t}",
    equipo: "Tu equipo",
    letras: "Letras",
    tiempo: "Tiempo",
    oculto: "Oculto",
    empezar: "Empezar",
    estado_resuelta: "Resuelta",
    estado_actual: "En curso",
    estado_bloqueada: "Bloqueada",
    estado_libre: "Lista para jugar",
    logro_titulo: "¡Candado abierto!",
    logro_sub: "Ya tenés una letra más del código.",
    logro_sub_2: "Ya tenés dos letras más del código.",
    version: "Versión {d}",
    repaso: "Repaso",
    repaso_aviso: "Nueva versión de la sala: {d}.",
    otra_version: "Jugar otra versión",
    otra_version_txt: "Resolviste la versión {d}. Cada sala tiene tres versiones: jugá otra para sumar insignias.",
    insignias_t: "Insignias",
    insignias_intro: "Cada sala tiene tres versiones: inicial, intermedia y avanzada. Resolvé las cinco salas en una misma versión y ganás su insignia. Para cambiar de versión, volvé a jugar una sala que ya resolviste.",
    insignias_ganadas: "ganadas",
    insignias_descargar: "Descargar mis insignias",
    insignias_descargadas: "Listo: se descargó la imagen con tus insignias.",
    insignias_error: "No se pudo crear la imagen. Probá de nuevo.",
    insignias_imagen_k: "Escape room de finanzas",
    insignias_imagen_t: "Mis insignias",
    insignias_imagen_pie: "Tu primer sueldo | Taller Del aula al primer trabajo",
    insignia_nombre: "Insignia {d}",
    insignia_desc: "Las cinco salas resueltas en su versión {d}.",
    insignia_salas: "Salas resueltas en versión {d}",
    insignia_ganada: "Ganada",
    insignia_progreso: "{p} de {t} salas",
    insignia_nueva: "¡Ganaste la insignia {d}!",
    insignia_nueva_txt: "Resolviste las cinco salas en esa versión.",
    reinicio_total: "Avance e insignias borrados. Empezás de cero.",
    reinicio_partida: "Partida nueva. Tus insignias se conservan.",
    repasar: "Repasar",
    reiniciar_confirmar: "¿Seguro? Se borran tu avance y tus insignias del escape room."
  },

  salas: [
    {
      id: 1,
      nombre: "Recepción",
      titulo: "El recibo",
      icono: "j-recibo",
      escena: "En el escritorio de recepción quedó tu recibo de sueldo, con una taza de café volcada encima. Al lado hay una nota de Recursos Humanos.",
      objetos: [
        {
          id: "recibo",
          tipo: "recibo",
          nombre: "Recibo de sueldo",
          accion: "Abrir el recibo de sueldo",
          resumen: "Tu primera liquidación, con una mancha de café.",
          empresa: "Talleres Del Plata S.A.",
          cuit: "30-XXXXXXXX-X",
          trabajador: "TU NOMBRE",
          cuil: "20-XXXXXXXX-X",
          periodo: "Mes 1",
          categoria: "Ayudante técnico/a",
          ingreso: "Este mes",
          contribuciones: [
            { concepto: "Contribución seguridad social", unidad: "18 %", monto: "180.000,00" },
            { concepto: "Obra social patronal", unidad: "6 %", monto: "60.000,00" }
          ],
          contribuciones_total: "240.000,00",
          contribuciones_nota: "Lo paga la empresa además de tu sueldo. No se descuenta de lo que cobrás.",
          haberes: [
            { concepto: "Sueldo básico", unidad: "30 días", monto: "1.000.000,00" }
          ],
          bruto: "1.000.000,00",
          deducciones: [
            { concepto: "Jubilación", unidad: "11 %" },
            { concepto: "Ley 19.032 (PAMI)", unidad: "3 %" },
            { concepto: "Obra social", unidad: "3 %" }
          ],
          mancha: "Monto ilegible: tapado por una mancha de café"
        },
        {
          id: "nota",
          tipo: "nota",
          nombre: "Nota de Recursos Humanos",
          accion: "Leer la nota de Recursos Humanos",
          resumen: "Un papel pegado en el monitor.",
          firma: "Recursos Humanos",
          lineas: [
            "¡Bienvenido/a al equipo!",
            "Los descuentos del trabajador suman 17 %.",
            "Cualquier duda, pasá por la oficina."
          ]
        }
      ],
      candado: {
        tipo: "numero",
        etiqueta: "¿Cuál es tu sueldo neto?",
        ayuda: "Escribí el monto en pesos, sin centavos. Son 6 dígitos.",
        prefijo: "$",
        respuestas: ["830000"],
        errores: [
          { id: "bruto", valores: ["1000000"], mensaje: "Ese es el bruto. El neto es lo que te queda después de los descuentos." },
          { id: "descuentos", valores: ["170000"], mensaje: "Eso es lo que te descuentan. ¿Cuánto te queda a vos?" },
          { id: "suma_parcial", valores: ["890000", "970000", "860000"], mensaje: "Revisá: ¿sumaste los tres descuentos?" },
          { id: "contribuciones", valores: ["760000"], mensaje: "Restaste las contribuciones de la empresa. Esas las paga la empresa aparte: no salen de tu sueldo." },
          { id: "costo_empresa", valores: ["1240000"], mensaje: "Eso es lo que le cuesta tu trabajo a la empresa. Vos cobrás menos que el bruto, no más." }
        ]
      },
      pistas: [
        "Bruto menos descuentos es igual a neto.",
        "El 17 % de $1.000.000 es $170.000."
      ],
      debrief: {
        texto: [
          "El sueldo bruto es lo que ganás. El neto es lo que cobrás después de tus aportes: jubilación (11 %), Ley 19.032 o PAMI (3 %) y obra social (3 %).",
          "Según el convenio de tu actividad, puede haber además un aporte sindical. Y aparte de tu sueldo, la empresa paga contribuciones que no se te descuentan."
        ],
        link: { texto: "Repasá cómo se lee un recibo", href: "../#recibo" }
      },
      reflexion: "¿Qué dato del recibo te conviene revisar todos los meses, y por qué?"
    },
    {
      id: 2,
      nombre: "Oficina",
      titulo: "El presupuesto",
      icono: "j-lista",
      escena: "En el escritorio de la oficina hay una lista con tus gastos del mes. Pegado en la taza, un post-it.",
      objetos: [
        {
          id: "lista",
          tipo: "lista",
          nombre: "Lista de gastos del mes",
          accion: "Leer la lista de gastos del mes",
          resumen: "Lo que pensás gastar con tu primer sueldo.",
          titulo_doc: "Mis gastos del mes",
          filas: [
            { concepto: "Alquiler compartido", monto: "$ 250.000" },
            { concepto: "Carga de la SUBE", monto: "$ 35.000" },
            { concepto: "Plan básico de celular", monto: "$ 18.000" },
            { concepto: "Salida del sábado", monto: "$ 40.000" },
            { concepto: "Zapatillas de marca para estrenar", monto: "$ 100.000" },
            { concepto: "Café de paso todos los días", monto: "Ver post-it" }
          ]
        },
        {
          id: "postit",
          tipo: "nota",
          nombre: "Post-it de la taza",
          accion: "Leer el post-it de la taza",
          resumen: "Una cuenta que quedó a medias.",
          firma: "Vos, ayer",
          lineas: [
            "Café de paso: $3.000.",
            "Todos los días hábiles (22 al mes).",
            "¿Cuánto es por mes?"
          ]
        }
      ],
      previo: {
        tipo: "clasificar",
        titulo: "Clasificá tus gastos",
        consigna: "Antes de abrir el candado, marcá si cada gasto es una necesidad o un gusto.",
        categorias: ["Necesidad", "Gusto"],
        items: [
          { id: "alquiler", texto: "Alquiler compartido", correcta: 0 },
          { id: "sube", texto: "Carga de la SUBE", correcta: 0 },
          { id: "celular", texto: "Plan básico de celular", correcta: 0 },
          { id: "salida", texto: "Salida del sábado", correcta: 1 },
          { id: "zapatillas", texto: "Zapatillas de marca para estrenar", correcta: 1 },
          { id: "cafe", texto: "Café de paso todos los días", correcta: 1 }
        ],
        boton: "Revisar",
        falta: "Te falta clasificar algún gasto.",
        error: "Hay gastos para revisar. Están marcados abajo.",
        revisar: "Revisá este",
        ok: "¡Bien clasificados! Se encendió el candado."
      },
      candado: {
        tipo: "numero",
        etiqueta: "¿Cuánto se va por mes en café?",
        ayuda: "Escribí el monto en pesos, sin centavos.",
        prefijo: "$",
        respuestas: ["66000"],
        errores: [
          { id: "un_cafe", valores: ["3000"], mensaje: "Ese es un solo café. ¿Y en el mes?" },
          { id: "dias_corridos", valores: ["90000", "93000"], mensaje: "Contaste todos los días del mes. El post-it dice días hábiles." },
          { id: "por_semana", valores: ["15000"], mensaje: "Eso es lo de una semana hábil. El candado pide el mes." }
        ]
      },
      pistas: [
        "Multiplicá el precio del café por la cantidad de días.",
        "3.000 × 22."
      ],
      debrief: {
        texto: [
          "Los gastos hormiga son gastos chicos y repetidos: un café por día parece poco, pero son $66.000 por mes, casi el 8 % de un sueldo neto de $830.000.",
          "Para repartir el ingreso, una referencia es la regla 50 / 20 / 30: la mitad para lo esencial, un 20 % para ahorro e inversión y un 30 % para deseos. Es una guía, no una obligación."
        ],
        link: { texto: "Probá la calculadora de gastos hormiga", href: "../#fin-hormiga" }
      },
      reflexion: "¿Qué gasto hormiga tenés vos, o alguien que conocés, y cuánto suma en un mes?"
    },
    {
      id: 3,
      nombre: "Caja",
      titulo: "La tarjeta",
      icono: "j-tarjeta",
      escena: "Sobre el mostrador de la caja quedaron el resumen de tu tarjeta y dos folletos del mismo celular en 12 cuotas.",
      objetos: [
        {
          id: "resumen",
          tipo: "resumen",
          nombre: "Resumen de la tarjeta",
          accion: "Leer el resumen de la tarjeta",
          resumen: "Lo que gastaste este mes con la tarjeta.",
          titulo_doc: "Resumen de tu tarjeta de crédito",
          filas: [
            { concepto: "Saldo total a pagar", monto: "$ 200.000", destacado: true },
            { concepto: "Pago mínimo", monto: "$ 20.000" },
            { concepto: "Vencimiento", monto: "Día 10" }
          ],
          nota: "Si pagás menos que el saldo total, la diferencia se financia y genera intereses."
        },
        {
          id: "folleto_a",
          tipo: "folleto",
          nombre: "Folleto A",
          accion: "Leer el folleto A",
          resumen: "La cuota más baja de la vidriera.",
          marca: "Oferta A",
          titular: "12 cuotas de $26.000",
          precio: "Precio de contado: $240.000",
          detalles: ["Comisión de otorgamiento: $30.000", "Seguro: $2.000 por mes"],
          tasas: [
            { sigla: "TNA", valor: "47 %" },
            { sigla: "CFTEA", valor: "157 %", destacado: true }
          ]
        },
        {
          id: "folleto_b",
          tipo: "folleto",
          nombre: "Folleto B",
          accion: "Leer el folleto B",
          resumen: "La cuota es apenas más alta.",
          marca: "Oferta B",
          titular: "12 cuotas de $28.000",
          precio: "Precio de contado: $240.000",
          detalles: ["Sin comisiones", "Sin seguros"],
          tasas: [
            { sigla: "TNA", valor: "67 %" },
            { sigla: "CFTEA", valor: "92 %", destacado: true }
          ]
        }
      ],
      candado: {
        tipo: "palabra",
        etiqueta: "¿Qué dato tenés que comparar entre las dos ofertas?",
        ayuda: "Escribí la sigla. Está en los dos folletos.",
        respuestas: ["CFT", "CFTEA"],
        errores: [
          { id: "tna", valores: ["TNA"], mensaje: "La TNA no incluye todos los costos. Buscá el dato que suma todo." },
          { id: "tea", valores: ["TEA"], mensaje: "La TEA es la tasa de interés efectiva, pero no suma comisiones ni seguros." },
          { id: "iva", valores: ["IVA"], mensaje: "No es un impuesto suelto: es el costo total de financiarte." },
          { id: "cuota", valores: ["CUOTA", "CUOTAS"], mensaje: "La cuota más baja no siempre es la más barata. Buscá una sigla." }
        ]
      },
      pistas: [
        "Buscalo al lado de la tasa en los dos folletos: es el dato que suma todos los costos.",
        "Es la sigla de Costo Financiero Total."
      ],
      extra: {
        pregunta: "Si pagás solo el mínimo ($20.000), ¿qué pasa con los $180.000 que quedan?",
        opciones: [
          { texto: "Se perdonan si pagás el mínimo a tiempo.", correcta: false, feedback: "No: el resto sigue siendo una deuda. Pagar el mínimo solo evita la mora." },
          { texto: "Generan intereses y se suman al resumen del mes siguiente.", correcta: true, feedback: "Exacto: quedan financiados, generan intereses (más IVA sobre esos intereses) y aparecen en el próximo resumen." },
          { texto: "Se descuentan solos de tu próximo sueldo.", correcta: false, feedback: "No: nadie te los descuenta del sueldo. Quedan como deuda en la tarjeta y generan intereses." }
        ]
      },
      debrief: {
        texto: [
          "Si pagás solo el mínimo, el resto del resumen queda financiado: genera intereses, más IVA sobre esos intereses, y aparece en el resumen del mes siguiente.",
          "En las compras en cuotas, la cuota más baja no siempre es la más barata. Para comparar, mirá el costo financiero total (CFT o CFTEA): suma intereses, comisiones y seguros. Por eso la oferta B, con cuota más alta, termina siendo más barata."
        ],
        link: { texto: "Repasá cómo salir de deudas", href: "../#fin-deudas" }
      },
      reflexion: "Antes de comprar algo en cuotas, ¿qué vas a mirar a partir de hoy?"
    },
    {
      id: 4,
      nombre: "Bóveda",
      titulo: "La inflación",
      icono: "j-grafico",
      escena: "En la caja fuerte está el sobre donde guardaste plata para las zapatillas que anotaste en el presupuesto. Al lado, la etiqueta de precio.",
      objetos: [
        {
          id: "sobre",
          tipo: "sobre",
          nombre: "Sobre de ahorro",
          accion: "Mirar el sobre de ahorro",
          resumen: "La plata que juntaste el mes pasado.",
          rotulo: "Para las zapatillas",
          monto: "$ 100.000",
          nota: "Lo guardé el mes pasado, justo lo que costaban."
        },
        {
          id: "etiqueta",
          tipo: "etiqueta",
          nombre: "Etiqueta de precio",
          accion: "Mirar la etiqueta de precio",
          resumen: "El precio de las zapatillas, actualizado.",
          producto: "Zapatillas de marca",
          antes: "Mes pasado: $ 100.000",
          ahora: "Este mes: subieron 10 %"
        }
      ],
      candado: {
        tipo: "numero",
        etiqueta: "¿Cuánta plata te falta ahora para las zapatillas?",
        ayuda: "Escribí el monto en pesos, sin centavos.",
        prefijo: "$",
        respuestas: ["10000"],
        errores: [
          { id: "precio_nuevo", valores: ["110000"], mensaje: "Ese es el precio nuevo. ¿Cuánto te falta con lo que tenés en el sobre?" },
          { id: "cero", valores: ["0"], mensaje: "Los precios subieron, pero tu sobre no." },
          { id: "baja", valores: ["90000"], mensaje: "Calculaste un 10 % menos. El precio subió, no bajó." }
        ]
      },
      pistas: [
        "Calculá primero el precio nuevo.",
        "100.000 más el 10 % es 110.000."
      ],
      extra: {
        pregunta: "Para un fondo de emergencia que podés necesitar mañana, ¿qué es lo más importante?",
        opciones: [
          { texto: "Que puedas sacar la plata en el día (liquidez).", correcta: true, feedback: "Exacto: un fondo de emergencia tiene que estar disponible en 24 horas y con bajo riesgo, por ejemplo en una cuenta remunerada o un fondo money market." },
          { texto: "Que rinda lo máximo posible, aunque tarde en estar disponible.", correcta: false, feedback: "El rendimiento importa, pero si lo necesitás mañana y no podés sacarlo, no te sirve como fondo de emergencia." },
          { texto: "Que esté en un plazo fijo tradicional.", correcta: false, feedback: "El plazo fijo tradicional inmoviliza la plata al menos 30 días: no es lo ideal para una emergencia." }
        ]
      },
      debrief: {
        texto: [
          "Con inflación, la plata quieta pierde poder de compra: el sobre sigue teniendo $100.000, pero ahora alcanza para menos.",
          "Ahorrar es guardar; invertir es poner la plata a trabajar, con algo de riesgo. Para el fondo de emergencia, de 3 a 6 meses de gastos básicos, lo primero es la liquidez."
        ],
        link: { texto: "Probá el control de inflación", href: "../#fin-inflacion" }
      },
      reflexion: "¿Para qué te gustaría ahorrar con tu primer sueldo, y dónde guardarías esa plata?"
    },
    {
      id: 5,
      nombre: "Salida",
      titulo: "Los mensajes",
      icono: "j-celular",
      escena: "Ya casi estás afuera. Tu celular vibra: llegaron cuatro mensajes. Uno solo es de verdad.",
      objetos: [
        {
          id: "celular",
          tipo: "celular",
          nombre: "Tu celular",
          accion: "Mirar los mensajes del celular",
          resumen: "Cuatro mensajes nuevos.",
          mensajes: [
            { id: "sms", canal: "SMS", de: "BANCO-AVISO", texto: "Tu cuenta fue bloqueada. Ingresá YA en bit.ly/desbloq-cuenta para evitar la baja definitiva." },
            { id: "whatsapp", canal: "WhatsApp", de: "Sofi (número nuevo)", texto: "¡Hola! Te llegó un código de 6 números por SMS, ¿me lo pasás? Es para anotarte en un sorteo, dale que se termina hoy." },
            { id: "mail", canal: "Mail", de: "premios@ganador-oficial-ar.com", texto: "¡Felicitaciones! Ganaste $500.000. Completá tus datos y los de tu tarjeta para cobrar el premio antes de las 18 h." },
            { id: "app", canal: "Notificación de la app", de: "Tu cuenta sueldo", texto: "Recibiste una transferencia de $830.000 de Talleres Del Plata S.A. Concepto: sueldo." }
          ]
        }
      ],
      candado: {
        tipo: "seleccion",
        etiqueta: "Marcá los mensajes que son estafas.",
        ayuda: "Son tres. Marcá solo esos.",
        opciones: [
          { id: "sms", texto: "SMS de BANCO-AVISO" },
          { id: "whatsapp", texto: "WhatsApp de Sofi (número nuevo)" },
          { id: "mail", texto: "Mail del premio" },
          { id: "app", texto: "Notificación de la app" }
        ],
        respuestas: ["mail,sms,whatsapp"],
        legitimo: { id: "app", mensaje: "Marcaste el aviso de la app. Ese es real: no tiene links, no te apura, no te pide nada y coincide con tu sueldo." },
        faltantes: {
          sms: "Te falta una estafa: el SMS te apura y te manda a un link acortado. Los bancos no te piden entrar así.",
          whatsapp: "Te falta una estafa: el WhatsApp te pide un código de verificación. Con ese código pueden robarte la cuenta.",
          mail: "Te falta una estafa: el mail promete un premio que no pediste y te pide los datos de tu tarjeta."
        }
      },
      pistas: [
        "Desconfiá de la urgencia y de los pedidos de códigos.",
        "Una de las estafas es el WhatsApp que te pide un código."
      ],
      debrief: {
        texto: [
          "Nunca compartas códigos de verificación ni claves: ninguna entidad te los pide por mensaje. Desconfiá de la urgencia, de los links raros y de los premios que no pediste.",
          "Antes de transferir a un alias nuevo, revisá el nombre del titular que muestra la app. Si te pasa algo, avisá enseguida a tu banco o billetera y hacé la denuncia."
        ],
        link: { texto: "Repasá ejecución y seguridad", href: "../#fin-ejecucion" }
      },
      reflexion: "¿Qué harías si te llega un mensaje pidiéndote un código?"
    }
  ]
};
