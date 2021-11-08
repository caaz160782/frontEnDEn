let dataString={}
const CLOUDINARY = 'https://api.cloudinary.com/v1_1/dcakvkbpz/image/upload'
const Cloudinary_preset = 'vn5lewjj'
let token = sessionStorage.getItem('apitoken');
let userData =JSON.parse(sessionStorage.getItem('user'));
const{_id,fullName,userName,pictureProfileUser}=userData
$('#fullname').val(fullName);
$('#username').val(userName);
$("#img-user").attr("src",pictureProfileUser);  


$('#pictureProfileUser').change(async (e)=> {
    let imgPrev = document.getElementById('img-user')

    let file = e.target.files[0]
    const formData = new FormData() //Crea un nuevo formulario en HTML
    formData.append('file', file) //crea un imput tipo file, y recibe la informacion de la imagen
    formData.append('upload_preset', Cloudinary_preset) // crea un nuevo input, en donde ingresa el psw de cloudinary
    //async = true
    const res = await axios.post(CLOUDINARY, formData, {
     headers: { 'Content-Type': 'multipart/form-data' } //informacion que ingresa a cloudinary
     })
    let imgtoDb = res.data.secure_url
    dataString.pictureProfileUser = imgtoDb
    imgPrev.src = res.data.secure_url
 })


$('#btnSubmitLogin').click(function(){  
 //   dataString.pictureProfileUser = "https://www.semana.com/resizer/P6mLrvtX15JDFGbCp8YUn_BfJvs=/1200x675/filters:format(jpg):quality(50)//cloudfront-us-east-1.images.arcpublishing.com/semana/FBKIAGQ5ZRBW3G45VV6WWYN6RY.JPG"
    let fullName  = $('#fullname').val();  
    let userName  = $('#username').val();    
    if(fullName ==="" || userName ==="")
    {
        alert("capture el dato a modificar");
     }
    else{
        dataString.fullName  = fullName
    dataString.userName  = userName
    dataString.password  = $('#password').val();
     
     $.ajax({
          url:`http://localhost:8000/users/${_id}`,
          headers: {"apitoken" : token }, 
          method: 'PATCH',
          data:JSON.stringify(dataString),
          dataType:"json",        
          contentType:"application/json;charset=UTF-8",

          success: response => {
              console.log(response)
              const {ok,userUpdate}=response;
              if (ok)
               {
                //sessionStorage.clear();
                sessionStorage.removeItem('user');
                sessionStorage.setItem('user',JSON.stringify(userUpdate))
                $(location).attr('href','index.html');                 
               }
           }, //success		
           error: error => {  
               console.log(error)
                alert("No se pudo actualizar Usuario");
            }
      });       
    }  
 })