/* Versiones de cada sala del escape room "Tu primer sueldo".
   Cada sala tiene tres versiones: inicial, intermedia y avanzada. La inicial es el contenido
   que está en escape-finanzas.js; las otras dos reemplazan solo los campos que cambian
   (escena, objetos, desafío previo, candado, pistas, pregunta extra y explicación).
   Al empezar una partida, cada sala toma una versión al azar, priorizando las que la persona
   todavía no resolvió. Al volver a jugar una sala ya resuelta, cambia de versión.
   Todos los montos, tasas, nombres y dominios son ficticios. Reglas de estilo: voseo y sin rayas largas. */
window.ESC_VERSIONES = {
  dificultades: [
    { id: "inicial", nombre: "Inicial", metal: "Bronce" },
    { id: "intermedia", nombre: "Intermedia", metal: "Plata" },
    { id: "avanzada", nombre: "Avanzada", metal: "Oro" }
  ],

  /* Palabra de la puerta final: una al azar por partida.
     Con 5 letras, cada sala da una letra; con 10 letras, cada sala da dos. */
  palabras: [
    {
      palabra: "METAS",
      pregunta: "¿Qué necesitás para que tu sueldo te alcance?",
      errores: [{ id: "temas", valores: ["TEMAS", "MATES"], mensaje: "Usaste todas las letras, pero esa palabra no responde la pregunta." }]
    },
    {
      palabra: "RENTA",
      pregunta: "¿Cómo se llama lo que te paga una inversión por usar tu plata?",
      errores: [{ id: "terna", valores: ["TERNA"], mensaje: "Usaste todas las letras, pero esa palabra no responde la pregunta." }]
    },
    {
      palabra: "DISCIPLINA",
      pregunta: "¿Qué hábito hace que un presupuesto funcione mes a mes?",
      errores: []
    },
    {
      palabra: "PLANIFICAR",
      pregunta: "¿Qué conviene hacer con tu sueldo antes de empezar a gastarlo?",
      errores: []
    }
  ],

  salas: {
    /* ---------- Sala 1 | El recibo ---------- */
    1: [
      {},
      {
        /* Intermedia: el bruto tiene horas extras y la nota no da el porcentaje total */
        objetos: [
          {
            id: "recibo",
            tipo: "recibo",
            nombre: "Recibo de sueldo",
            accion: "Abrir el recibo de sueldo",
            resumen: "Tu primera liquidación, con horas extras y una mancha de café.",
            empresa: "Talleres Del Plata S.A.",
            cuit: "30-XXXXXXXX-X",
            trabajador: "TU NOMBRE",
            cuil: "20-XXXXXXXX-X",
            periodo: "Mes 1",
            categoria: "Ayudante técnico/a",
            ingreso: "Este mes",
            contribuciones: [
              { concepto: "Contribución seguridad social", unidad: "18 %", monto: "216.000,00" },
              { concepto: "Obra social patronal", unidad: "6 %", monto: "72.000,00" }
            ],
            contribuciones_total: "288.000,00",
            contribuciones_nota: "Lo paga la empresa además de tu sueldo. No se descuenta de lo que cobrás.",
            haberes: [
              { concepto: "Sueldo básico", unidad: "30 días", monto: "1.100.000,00" },
              { concepto: "Horas extras", unidad: "10 horas", monto: "100.000,00" }
            ],
            bruto: "1.200.000,00",
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
              "Este mes hiciste horas extras: ya están en tu recibo.",
              "Revisá que cada descuento esté bien calculado."
            ]
          }
        ],
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuál es tu sueldo neto?",
          ayuda: "Escribí el monto en pesos, sin centavos. Son 6 dígitos.",
          prefijo: "$",
          respuestas: ["996000"],
          errores: [
            { id: "bruto", valores: ["1200000"], mensaje: "Ese es el bruto. El neto es lo que te queda después de los descuentos." },
            { id: "descuentos", valores: ["204000"], mensaje: "Eso es lo que te descuentan. ¿Cuánto te queda a vos?" },
            { id: "sin_extras", valores: ["913000"], mensaje: "Calculaste el neto solo del básico. Las horas extras también son parte del bruto." },
            { id: "suma_parcial", valores: ["1068000", "1032000", "1164000"], mensaje: "Revisá: ¿sumaste los tres descuentos?" },
            { id: "contribuciones", valores: ["912000"], mensaje: "Restaste las contribuciones de la empresa. Esas las paga la empresa aparte: no salen de tu sueldo." }
          ]
        },
        pistas: [
          "Primero sumá el básico y las horas extras: ese es el bruto.",
          "Los descuentos suman 11 + 3 + 3 = 17 %. El 17 % de $1.200.000 es $204.000."
        ],
        debrief: {
          texto: [
            "Las horas extras forman parte del sueldo bruto, así que también llevan descuentos: el 17 % de $1.200.000 son $204.000 y te quedan $996.000.",
            "Tus aportes son jubilación (11 %), Ley 19.032 o PAMI (3 %) y obra social (3 %). Aparte, la empresa paga contribuciones que no se te descuentan."
          ],
          link: { texto: "Repasá cómo se lee un recibo", href: "../#recibo" }
        }
      },
      {
        /* Avanzada: hay una suma no remunerativa que no lleva descuentos */
        objetos: [
          {
            id: "recibo",
            tipo: "recibo",
            nombre: "Recibo de sueldo",
            accion: "Abrir el recibo de sueldo",
            resumen: "Tu primera liquidación, con una suma no remunerativa.",
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
            no_remunerativos: [
              { concepto: "Suma no remunerativa (acuerdo)", unidad: "Fija", monto: "100.000,00" }
            ],
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
              "Este mes cobrás una suma no remunerativa por acuerdo.",
              "En tu recibo, esa suma no tiene descuentos."
            ]
          }
        ],
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuál es tu sueldo neto?",
          ayuda: "Escribí el monto en pesos, sin centavos. Son 6 dígitos.",
          prefijo: "$",
          respuestas: ["930000"],
          errores: [
            { id: "descuento_total", valores: ["913000"], mensaje: "Le aplicaste los descuentos también a la suma no remunerativa. Esa se cobra entera." },
            { id: "sin_no_rem", valores: ["830000"], mensaje: "Te faltó sumar la suma no remunerativa: también la cobrás." },
            { id: "todo", valores: ["1100000"], mensaje: "Eso es todo lo que figura antes de los descuentos. Todavía falta restarlos." },
            { id: "bruto", valores: ["1000000"], mensaje: "Ese es el bruto remunerativo. El neto es lo que te queda después de descontar y sumar lo no remunerativo." },
            { id: "descuentos", valores: ["170000", "187000"], mensaje: "Eso es lo que te descuentan. ¿Cuánto te queda a vos?" }
          ]
        },
        pistas: [
          "Los descuentos se calculan solo sobre el sueldo básico. La suma no remunerativa se cobra entera.",
          "1.000.000 − 170.000 + 100.000."
        ],
        debrief: {
          texto: [
            "Las sumas no remunerativas se cobran, pero en este recibo no forman parte de la base de los descuentos. Por eso el neto es $1.000.000 − $170.000 + $100.000 = $930.000.",
            "Ojo: como no llevan aportes, tampoco suman para tu jubilación. Por eso conviene que los aumentos sean remunerativos."
          ],
          link: { texto: "Repasá cómo se lee un recibo", href: "../#recibo" }
        }
      }
    ],

    /* ---------- Sala 2 | El presupuesto ---------- */
    2: [
      {},
      {
        /* Intermedia: dos gastos hormiga con la misma frecuencia */
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
              { concepto: "Café y alfajor de la tarde", monto: "Ver post-it" }
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
              "Café: $2.500. Alfajor: $1.500.",
              "Los dos, todos los días hábiles (22 al mes).",
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
            { id: "cafe", texto: "Café y alfajor de la tarde", correcta: 1 }
          ],
          boton: "Revisar",
          falta: "Te falta clasificar algún gasto.",
          error: "Hay gastos para revisar. Están marcados abajo.",
          revisar: "Revisá este",
          ok: "¡Bien clasificados! Se encendió el candado."
        },
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuánto se va por mes en café y alfajor?",
          ayuda: "Escribí el monto en pesos, sin centavos.",
          prefijo: "$",
          respuestas: ["88000"],
          errores: [
            { id: "un_dia", valores: ["4000"], mensaje: "Eso es lo de un solo día. ¿Y en el mes?" },
            { id: "solo_cafe", valores: ["55000"], mensaje: "Contaste solo el café. El alfajor también es todos los días." },
            { id: "solo_alfajor", valores: ["33000"], mensaje: "Contaste solo el alfajor. Sumale el café." },
            { id: "dias_corridos", valores: ["120000", "124000"], mensaje: "Contaste todos los días del mes. El post-it dice días hábiles." },
            { id: "por_semana", valores: ["20000"], mensaje: "Eso es lo de una semana hábil. El candado pide el mes." }
          ]
        },
        pistas: [
          "Sumá lo que gastás en un día y multiplicalo por los días hábiles.",
          "(2.500 + 1.500) × 22."
        ],
        debrief: {
          texto: [
            "Los gastos hormiga son gastos chicos y repetidos: un café y un alfajor por día parecen poco, pero son $88.000 por mes, más del 10 % de un sueldo neto de $830.000.",
            "Para repartir el ingreso, una referencia es la regla 50 / 20 / 30: la mitad para lo esencial, un 20 % para ahorro e inversión y un 30 % para deseos. Es una guía, no una obligación."
          ],
          link: { texto: "Probá la calculadora de gastos hormiga", href: "../#fin-hormiga" }
        }
      },
      {
        /* Avanzada: dos gastos hormiga con distinta frecuencia */
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
              { concepto: "Café diario y delivery del sábado", monto: "Ver post-it" }
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
              "Café de paso: $3.000, los días hábiles (22 al mes).",
              "Delivery: $12.000, cada sábado (4 al mes).",
              "¿Cuánto suman por mes?"
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
            { id: "cafe", texto: "Café diario y delivery del sábado", correcta: 1 }
          ],
          boton: "Revisar",
          falta: "Te falta clasificar algún gasto.",
          error: "Hay gastos para revisar. Están marcados abajo.",
          revisar: "Revisá este",
          ok: "¡Bien clasificados! Se encendió el candado."
        },
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuánto suman por mes tus gastos hormiga?",
          ayuda: "Escribí el monto en pesos, sin centavos.",
          prefijo: "$",
          respuestas: ["114000"],
          errores: [
            { id: "solo_cafe", valores: ["66000"], mensaje: "Contaste solo el café. Sumale el delivery de los sábados." },
            { id: "solo_delivery", valores: ["48000"], mensaje: "Contaste solo el delivery. Sumale el café de los días hábiles." },
            { id: "un_dia", valores: ["15000"], mensaje: "Eso es un café y un delivery. ¿Cuánto es en todo el mes?" },
            { id: "todo_por_22", valores: ["330000"], mensaje: "Multiplicaste todo por 22. El delivery es solo los sábados." },
            { id: "dias_corridos", valores: ["138000", "141000"], mensaje: "Contaste el café todos los días del mes. El post-it dice días hábiles." }
          ]
        },
        pistas: [
          "Calculá cada gasto por separado: el café por los días hábiles y el delivery por los sábados.",
          "3.000 × 22 + 12.000 × 4."
        ],
        debrief: {
          texto: [
            "Los gastos hormiga son gastos chicos y repetidos. Sumados, el café de los días hábiles y el delivery de los sábados son $114.000 por mes, casi el 14 % de un sueldo neto de $830.000.",
            "Para repartir el ingreso, una referencia es la regla 50 / 20 / 30: la mitad para lo esencial, un 20 % para ahorro e inversión y un 30 % para deseos. Es una guía, no una obligación."
          ],
          link: { texto: "Probá la calculadora de gastos hormiga", href: "../#fin-hormiga" }
        }
      }
    ],

    /* ---------- Sala 3 | La tarjeta ---------- */
    3: [
      {},
      {
        /* Intermedia: calcular el total de la oferta que conviene */
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuánto pagás en total por el celular con la oferta que más conviene?",
          ayuda: "Escribí el monto en pesos, sin centavos. Sumá todo lo que pagás en 12 meses.",
          prefijo: "$",
          respuestas: ["336000"],
          errores: [
            { id: "total_a", valores: ["366000"], mensaje: "Ese es el total de la oferta A, con comisión y seguro. Compará con la B." },
            { id: "cuotas_a", valores: ["312000"], mensaje: "Esas son solo las cuotas de la A. La comisión y el seguro también se pagan." },
            { id: "contado", valores: ["240000"], mensaje: "Ese es el precio de contado. La pregunta es por la compra en cuotas." },
            { id: "una_cuota", valores: ["26000", "28000"], mensaje: "Esa es una sola cuota. ¿Y las 12?" }
          ]
        },
        pistas: [
          "Sumá todo lo que pagás en cada oferta: cuotas, comisión y seguro.",
          "A: 12 × 26.000 + 30.000 + 12 × 2.000 = 366.000. B: 12 × 28.000."
        ],
        debrief: {
          texto: [
            "La oferta A tiene la cuota más baja, pero con la comisión y el seguro pagás $366.000. La B, sin cargos extra, cuesta $336.000. El costo financiero total (CFT o CFTEA) resume esa diferencia: comparalo siempre antes de elegir.",
            "Si pagás solo el mínimo del resumen, el resto queda financiado: genera intereses, más IVA sobre esos intereses, y aparece en el resumen del mes siguiente."
          ],
          link: { texto: "Repasá cómo salir de deudas", href: "../#fin-deudas" }
        }
      },
      {
        /* Avanzada: otros folletos y calcular la diferencia entre las dos ofertas */
        escena: "Sobre el mostrador de la caja quedaron el resumen de tu tarjeta y dos folletos de otro celular en 12 cuotas.",
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
            titular: "12 cuotas de $30.000",
            precio: "Precio de contado: $280.000",
            detalles: ["Comisión de otorgamiento: $40.000", "Seguro: $2.500 por mes"],
            tasas: [
              { sigla: "TNA", valor: "49 %" },
              { sigla: "CFTEA", valor: "168 %", destacado: true }
            ]
          },
          {
            id: "folleto_b",
            tipo: "folleto",
            nombre: "Folleto B",
            accion: "Leer el folleto B",
            resumen: "La cuota es un poco más alta.",
            marca: "Oferta B",
            titular: "12 cuotas de $33.000",
            precio: "Precio de contado: $280.000",
            detalles: ["Sin comisiones", "Sin seguros"],
            tasas: [
              { sigla: "TNA", valor: "71 %" },
              { sigla: "CFTEA", valor: "97 %", destacado: true }
            ]
          }
        ],
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuánto más pagás en total si elegís la oferta A en vez de la B?",
          ayuda: "Escribí la diferencia en pesos, sin centavos.",
          prefijo: "$",
          respuestas: ["34000"],
          errores: [
            { id: "solo_cuotas", valores: ["36000"], mensaje: "Comparaste solo las cuotas. La A suma comisión y seguro: calculá el total de cada una." },
            { id: "cargos_a", valores: ["70000"], mensaje: "Esos son los cargos extra de la A. Te falta restar lo que la B te cobra de más en las cuotas." },
            { id: "total_a", valores: ["430000"], mensaje: "Ese es el total de la A. La pregunta es la diferencia con la B." },
            { id: "total_b", valores: ["396000"], mensaje: "Ese es el total de la B. La pregunta es la diferencia con la A." },
            { id: "sobre_contado", valores: ["150000"], mensaje: "Eso es lo que la A te cobra por encima del contado. Compará con la B." }
          ]
        },
        pistas: [
          "Calculá el total de cada oferta: cuotas, comisión y seguro.",
          "A: 12 × 30.000 + 40.000 + 12 × 2.500 = 430.000. B: 12 × 33.000 = 396.000."
        ],
        extra: {
          pregunta: "¿Qué incluye el CFT que no incluye la TNA?",
          opciones: [
            { texto: "Solo el IVA de la compra.", correcta: false, feedback: "No: el CFT incluye mucho más que el IVA. Suma todos los costos de financiarte." },
            { texto: "Las comisiones, los seguros y los impuestos, además de los intereses.", correcta: true, feedback: "Exacto: por eso el CFT es el dato para comparar ofertas. La TNA solo muestra la tasa de interés." },
            { texto: "Nada: son el mismo dato con otro nombre.", correcta: false, feedback: "No: la TNA es solo la tasa de interés. El CFT suma también comisiones, seguros e impuestos." }
          ]
        },
        debrief: {
          texto: [
            "Con la cuota más baja, la oferta A termina costando $34.000 más que la B: la comisión y el seguro pesan más que la diferencia de cuota. Por eso el CFTEA de la A es mucho más alto.",
            "Para comparar compras en cuotas, mirá el costo financiero total (CFT o CFTEA): suma intereses, comisiones, seguros e impuestos."
          ],
          link: { texto: "Repasá cómo salir de deudas", href: "../#fin-deudas" }
        }
      }
    ],

    /* ---------- Sala 4 | La inflación ---------- */
    4: [
      {},
      {
        /* Intermedia: dos meses de aumento que se acumulan */
        escena: "En la caja fuerte está el sobre donde guardaste plata para las zapatillas hace dos meses. Al lado, la etiqueta de precio.",
        objetos: [
          {
            id: "sobre",
            tipo: "sobre",
            nombre: "Sobre de ahorro",
            accion: "Mirar el sobre de ahorro",
            resumen: "La plata que juntaste hace dos meses.",
            rotulo: "Para las zapatillas",
            monto: "$ 100.000",
            nota: "Lo guardé hace dos meses, justo lo que costaban."
          },
          {
            id: "etiqueta",
            tipo: "etiqueta",
            nombre: "Etiqueta de precio",
            accion: "Mirar la etiqueta de precio",
            resumen: "El precio de las zapatillas, actualizado dos veces.",
            producto: "Zapatillas de marca",
            antes: "Hace dos meses: $ 100.000",
            ahora: "Subieron 10 % el mes pasado y otro 10 % este mes",
            mini: "+10 % ×2"
          }
        ],
        candado: {
          tipo: "numero",
          etiqueta: "¿Cuánta plata te falta ahora para las zapatillas?",
          ayuda: "Escribí el monto en pesos, sin centavos.",
          prefijo: "$",
          respuestas: ["21000"],
          errores: [
            { id: "suma_simple", valores: ["20000"], mensaje: "Sumaste 10 % + 10 %. El segundo aumento se calcula sobre el precio ya aumentado." },
            { id: "un_aumento", valores: ["10000"], mensaje: "Contaste un solo aumento. Fueron dos." },
            { id: "precio_nuevo", valores: ["121000", "120000"], mensaje: "Ese es el precio. ¿Cuánto te falta con lo que tenés en el sobre?" },
            { id: "cero", valores: ["0"], mensaje: "Los precios subieron, pero tu sobre no." }
          ]
        },
        pistas: [
          "Aplicá los aumentos de a uno: primero el del mes pasado y después el de este mes.",
          "100.000 → 110.000 → 121.000."
        ],
        debrief: {
          texto: [
            "Los aumentos se acumulan: dos subas del 10 % no son un 20 %, sino un 21 %, porque la segunda se aplica sobre el precio ya aumentado. La plata quieta pierde poder de compra mes a mes.",
            "Ahorrar es guardar; invertir es poner la plata a trabajar, con algo de riesgo. Para el fondo de emergencia, de 3 a 6 meses de gastos básicos, lo primero es la liquidez."
          ],
          link: { texto: "Probá el control de inflación", href: "../#fin-inflacion" }
        }
      },
      {
        /* Avanzada: la plata estuvo en una cuenta remunerada que rindió menos que la inflación */
        escena: "En la bóveda está el saldo de la cuenta remunerada donde dejaste la plata de las zapatillas. Al lado, la etiqueta de precio.",
        objetos: [
          {
            id: "sobre",
            tipo: "sobre",
            nombre: "Saldo de la cuenta remunerada",
            accion: "Mirar el saldo de la cuenta remunerada",
            resumen: "La plata que dejaste rindiendo el mes pasado.",
            rotulo: "Cuenta remunerada | zapatillas",
            monto: "$ 100.000",
            nota: "La dejé el mes pasado, justo lo que costaban. Este mes rindió 4 %."
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
          respuestas: ["6000"],
          errores: [
            { id: "sin_rendimiento", valores: ["10000"], mensaje: "No contaste lo que rindió la cuenta. Ahora tenés más que $100.000." },
            { id: "resta_rendimiento", valores: ["14000"], mensaje: "Restaste el rendimiento en vez de sumarlo. La cuenta te hizo ganar plata." },
            { id: "saldo", valores: ["104000"], mensaje: "Eso es lo que tenés ahora en la cuenta. ¿Cuánto te falta?" },
            { id: "precio_nuevo", valores: ["110000"], mensaje: "Ese es el precio nuevo. ¿Cuánto te falta con lo que tenés en la cuenta?" },
            { id: "cero", valores: ["0"], mensaje: "La cuenta rindió, pero menos de lo que subió el precio." }
          ]
        },
        pistas: [
          "Calculá cuánto tenés ahora en la cuenta y cuánto cuestan ahora las zapatillas.",
          "110.000 − 104.000."
        ],
        extra: {
          pregunta: "Si tu cuenta rinde 4 % por mes y los precios suben 10 %, ¿qué pasa con tu ahorro?",
          opciones: [
            { texto: "Gana poder de compra, porque tenés más pesos.", correcta: false, feedback: "Tenés más pesos, pero los precios subieron más: con esa plata comprás menos que antes." },
            { texto: "Pierde poder de compra, aunque crezca en pesos.", correcta: true, feedback: "Exacto: para no perder, el rendimiento tiene que ser igual o mayor que la inflación." },
            { texto: "Queda igual, porque la plata no se toca.", correcta: false, feedback: "No: si los precios suben más que tu rendimiento, la plata alcanza para menos." }
          ]
        },
        debrief: {
          texto: [
            "Dejar la plata rindiendo ayudó: te falta menos que con un sobre. Pero si el rendimiento (4 %) es menor que la inflación (10 %), igual perdés poder de compra.",
            "Ahorrar es guardar; invertir es poner la plata a trabajar, con algo de riesgo. Para el fondo de emergencia, de 3 a 6 meses de gastos básicos, lo primero es la liquidez."
          ],
          link: { texto: "Probá el control de inflación", href: "../#fin-inflacion" }
        }
      }
    ],

    /* ---------- Sala 5 | Los mensajes ---------- */
    5: [
      {},
      {
        /* Intermedia: tasa de envío, app de acceso remoto y cambio de alias */
        objetos: [
          {
            id: "celular",
            tipo: "celular",
            nombre: "Tu celular",
            accion: "Mirar los mensajes del celular",
            resumen: "Cuatro mensajes nuevos.",
            mensajes: [
              { id: "correo", canal: "SMS", de: "CORREO-AVISO", texto: "Tu paquete quedó retenido. Pagá $1.850 de tasa en correo-envios-ar.com antes de las 24 h o se devuelve al remitente." },
              { id: "soporte", canal: "WhatsApp", de: "Soporte Banco (número nuevo)", texto: "Detectamos un movimiento raro en tu cuenta. Para protegerte, instalá esta app de asistencia y pasanos el número que te aparece." },
              { id: "billetera", canal: "Notificación de la app", de: "Tu billetera", texto: "Pagaste $35.000 con QR en Supermercado Centro. Si no reconocés el pago, revisalo desde la app." },
              { id: "alquiler", canal: "WhatsApp", de: "Dueño del depto (número nuevo)", texto: "Hola, cambié de banco y de número. Este mes transferime el alquiler a este alias nuevo: depto.pago.hoy" }
            ]
          }
        ],
        candado: {
          tipo: "seleccion",
          etiqueta: "Marcá los mensajes que son estafas.",
          ayuda: "Son tres. Marcá solo esos.",
          opciones: [
            { id: "correo", texto: "SMS del paquete retenido" },
            { id: "soporte", texto: "WhatsApp de Soporte Banco" },
            { id: "billetera", texto: "Notificación de la billetera" },
            { id: "alquiler", texto: "WhatsApp del dueño del depto" }
          ],
          respuestas: ["alquiler,correo,soporte"],
          legitimo: { id: "billetera", mensaje: "Marcaste el aviso de la billetera. Ese es real: no tiene links, no te apura y te manda a revisar desde la app." },
          faltantes: {
            correo: "Te falta una estafa: el SMS te apura y te manda a pagar en un sitio que no es oficial.",
            soporte: "Te falta una estafa: nadie legítimo te pide instalar una app para \"protegerte\". Así toman el control de tu celular.",
            alquiler: "Te falta una estafa: un cambio de alias por un número nuevo hay que confirmarlo por otro medio antes de transferir."
          }
        },
        pistas: [
          "Desconfiá de los pagos urgentes, de las apps que te piden instalar y de los cambios de alias.",
          "Una de las estafas es el cambio de alias del alquiler."
        ],
        debrief: {
          texto: [
            "Nadie legítimo te pide instalar una app para protegerte ni pasarle un código. Si alguien te avisa que cambió de cuenta para cobrarte, confirmalo por otro medio antes de transferir. Y las tasas urgentes con links raros son un engaño clásico.",
            "Antes de transferir a un alias nuevo, revisá el nombre del titular que muestra la app. Si te pasa algo, avisá enseguida a tu banco o billetera y hacé la denuncia."
          ],
          link: { texto: "Repasá ejecución y seguridad", href: "../#fin-ejecucion" }
        }
      },
      {
        /* Avanzada: dominio falso de un organismo, trabajo que cobra matrícula y transferencia "por error" */
        objetos: [
          {
            id: "celular",
            tipo: "celular",
            nombre: "Tu celular",
            accion: "Mirar los mensajes del celular",
            resumen: "Cuatro mensajes nuevos.",
            mensajes: [
              { id: "arca", canal: "Mail", de: "notificaciones@arca-gob-ar.com", texto: "Tenés una deuda pendiente con ARCA. Regularizala hoy desde este enlace para evitar el embargo de tu sueldo." },
              { id: "banco", canal: "Mail", de: "avisos@tubanco.com.ar", texto: "Ingresaste a tu home banking desde un dispositivo nuevo. Si no fuiste vos, llamá al número que figura al dorso de tu tarjeta." },
              { id: "trabajo", canal: "WhatsApp", de: "RR. HH. Empleos Ya", texto: "¡Quedaste seleccionado/a para un trabajo desde casa! Para darte de alta, depositá $15.000 de matrícula." },
              { id: "devolucion", canal: "WhatsApp", de: "Número desconocido", texto: "Te mandé $40.000 por error, te paso el comprobante. ¿Me los devolvés a este alias? devolucion.ya.ok" }
            ]
          }
        ],
        candado: {
          tipo: "seleccion",
          etiqueta: "Marcá los mensajes que son estafas.",
          ayuda: "Son tres. Marcá solo esos.",
          opciones: [
            { id: "arca", texto: "Mail de la deuda con ARCA" },
            { id: "banco", texto: "Mail del aviso de ingreso" },
            { id: "trabajo", texto: "WhatsApp del trabajo desde casa" },
            { id: "devolucion", texto: "WhatsApp de la transferencia por error" }
          ],
          respuestas: ["arca,devolucion,trabajo"],
          legitimo: { id: "banco", mensaje: "Marcaste el aviso de ingreso. Ese es real: no tiene links ni te pide datos, y te manda a un canal oficial, el teléfono del dorso de tu tarjeta." },
          faltantes: {
            arca: "Te falta una estafa: el mail de la deuda viene de un dominio falso. Los organismos usan .gob.ar y no te intiman con un link.",
            trabajo: "Te falta una estafa: ningún trabajo serio te cobra para contratarte.",
            devolucion: "Te falta una estafa: el comprobante de una transferencia por error puede ser falso. Revisá tu saldo en la app antes de devolver nada."
          }
        },
        pistas: [
          "Fijate de dónde vienen los mails: los organismos usan dominios .gob.ar.",
          "Una de las estafas te pide plata para darte un trabajo."
        ],
        debrief: {
          texto: [
            "ARCA usa el dominio arca.gob.ar y no te intima por mail con un link. Ningún trabajo serio te cobra para contratarte. Y ante una transferencia por error, revisá el saldo en tu app: el comprobante puede ser falso.",
            "Un aviso real no te pide datos ni te apura con links: te manda a un canal oficial. Si te pasa algo, avisá enseguida a tu banco o billetera y hacé la denuncia."
          ],
          link: { texto: "Repasá ejecución y seguridad", href: "../#fin-ejecucion" }
        }
      }
    ]
  }
};
