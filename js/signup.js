$('#btnCreatedUser').click(function(){
    let email = $('#email').val();
    let pasword  = $('#password').val();
    let userName  = $('#username').val();
    let fullName  = $('#fullname').val();

    if(email=== '' || pasword==='' || username===""){
      alert("algun campo esta vacio");
    }
    else{
      let dataString = {email, pasword,userName,fullName};
      
      $.ajax({
          //url: 'http://localhost:8000/users'  ,
          url: 'https://backdev-humble-zebra-zj.mybluemix.net/users'  ,
          method: 'POST',
          data:JSON.stringify(dataString),
          dataType:"json",        
          contentType:"application/json;charset=UTF-8",
          success: response => {
              const {status}=response;
              if (status === 'ok')
               {
                $(location).attr('href','login.html');               
               }
           }, //success		
           error: error => {  
             console.error(error);
              let  {responseJSON}=error;
              if(responseJSON.errors[1].msg ==="el username ya esta registrado" || responseJSON.errors[0].msg ==="el correo ya esta registrado" )
              {
                alert("el username o email ya se encuentra registrado");
              }
              else{
                alert("No se puede crear");
              }
           }
      });
    }
 })