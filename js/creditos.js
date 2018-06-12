//metodo para abrir el modal de registro creditos
$('#registrar').on('click',function()
{
	$('[name=modalCreditos]').modal();
  buscar_documentocli();
})
//fin del metodo

//metodo para llenar select de cliente

var buscar_documentocli = function()
  {
    $.ajax({
    url: 'creditos_controller/obtener_doccliente',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
    	
      $('[name=modalCreditos]').find("#cliente").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalCreditos]').find("#cliente").val(event.value);
          $('[name=modalCreditos]').find("#clienteid").val(event.id);
	        }
	      });
	    }
	  })
  }


//fin del metodo

//metodo para registrar el prestamo

	$('#btnGuardarCredito').on('click',function()
	{
		var cliente = $('[name=clienteid]').val();
		var valor = $('[name=valor_prestado]').val();
		var validar = $('#formAgregarCredito').serializeArray();
		var error = false;
		var mensajerror;

		for (var i = 0; i < validar.length; i++) {
			var label = validar[i]['name'];
			var valor = validar[i]['value'];
			
			switch (label)
			{
				case 'clienteid':
				if (valor.trim()=== '')
				{
					var campo = $('[id=clientediv]');
					error = true;
					mensajerror = 'Ingrese identificación o Nombre del CLiente';
					campo.focus();
					campo.append('').addClass('has-error');
					i = validar.length + 1;
					break;
				}else{
					$(".has-error").removeClass("has-error");
				}
				break;
				case 'valor_prestado':
				if (valor.trim()=== '')
				{
					var campo = $('[id=valor_prestado]');
					error = true;
					mensajerror = 'Ingrese Valor de Prestamo';
					campo.focus();
					campo.append('').addClass('has-error');
					i = validar.length + 1;
					break;
				}
				break;
			}
		}
		if (error === true)
		{
			$.notify(
			{
				message : mensajerror
			},{
				type : 'danger',
				delay : 100,
				placement : {
					align: 'center'
				},
				z_index : 9999
			})
		}else{
		$.ajax(
		{
			url : 'creditos_controller/guardar_credito',
			type : 'POST',
			data : {
				cliente : cliente,
				valor : valor
			},
			success : function(response)
			{
				var respuesta = $.parseJSON(response);
				if (respuesta.success === true)
				{
					$.notify(
					{
						message : 'Guardado Exitosamente.'
					},{
						type : 'success',
						delay : 100,
						placement : {
							align : 'center'
						},
						z_index : 9999


					});
					$('[name=modalCreditos]').modal('hide');
					obtener_creditos();
				}else{
					$.notify(
					{
						message : 'Ocurrio un problema, Intentelo de nuevo.'
					},{
						type : 'danger',
						delay : 100,
						placement : {
							align : 'center'
						},
						z_index : 9999
					});
				}
			}
		})
	}
	})

// fin del metodo


//metodo para mostrar la tabla de creditos

	var obtener_creditos = function()
	{
		waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '        <td id="codigo">{0}</td>'+
      '            <span name="btnAgregar" id="btnAgregar"'+
      '              codigo_ficha="{0}" clave_ficha="{1}" abreviatura_ficha="{2}" detalle_ficha="{3}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Registrar Pago" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '        <td>{1} {2} {3} {4}</td>'+
      '        <td>{5}</td>'+
      '        <td>{6}</td>'+
      '        <td>{7}</td>'+
      '        </th>'+
      '    </tr>';

      $.ajax({
        url: 'creditos_controller/obtener_creditos',
        
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarasistencias.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;

            for (var i = 0; i < datos.length; i++) {


              componenteListarasistencias.append(modelFila.format(
                datos[i]['cre_id'], //0
                datos[i]['cli_pnombre'], //1
                datos[i]['cli_snombre'], //2
                datos[i]['cli_papellido'], //3
                datos[i]['cli_sapellido'], //4
                datos[i]['cre_prestamo'], //5
                datos[i]['cre_interes'], //6
                datos[i]['cre_fechaprest']//7
              ));
            }
            //$('[name=asistenciacheck]').on('click', guardar);
            $('[name=btnNoAsistio]').on('click', noasistio_relacion);
            $('[name=btnHistorial]').on('click',historial_relacion);
          }
          waitingDialog.hide();
        }
      })
}
	}

	obtener_creditos();

//fin del metodo