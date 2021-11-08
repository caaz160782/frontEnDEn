$('#btnSubmitLogin').click(function(){
    let email = $('#email').val();
    let password  = $('#password').val();
    let userName  = $('#username').val();
    let fullName  = $('#fullname').val();

    // if(email=== '' || pasword==='' || username===""){

      let dataString = {email, password,userName,fullName};
      console.log(dataString)
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTg3MzE5MGYxMTFkZTg4Nzg5ZTZiNzEiLCJuYW1lIjoiY2FybG9zIGFndWlycmUiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNjM2MzI2ODkzLCJleHAiOjE2MzY1ODYwOTN9._0Xf7ko4H5QGTRjfuGJVKAYWaq0ML59F_b3v_hFx4sE"
        let id = "61873190f111de88789e6b71"
      $.ajax({
            url:`http://localhost:8000/users/${id}`,
            headers: {"apitoken" : token }, 
          method: 'PATCH',
          data:JSON.stringify(dataString),
          dataType:"json",        
          contentType:"application/json;charset=UTF-8",
          success: response => {
              const {status}=response;
              if (status === 'ok')
               {
                console.log("Usuario se actualizo con exito");               
               }
           }, //success		
           error: error => {  
               console.log(error)
                alert("No se pudo actualizar Usuario");
            }

      });
    
 })