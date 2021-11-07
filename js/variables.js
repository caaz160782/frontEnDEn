//variables y selectores
export let postObj = {};

export let imagenPrincipal = $('#inputGroupFile01')
export let imagenes = $('#inputGroupFile02')
export let titlePost = $('#textareaTitle')
export let tags = $('#inputTags');
export let post = $('#textarea-post');

export let btnSubmit = $('#btn-submit')
export let formulario = $('#form')

export function misListener(){
  post.change(obtenerDatos)
  titlePost.change(obtenerDatos)
  imagenPrincipal.change(obtenerDatos)
  imagenes.change(obtenerDatos)
  tags.change(obtenerDatos)
}

function obtenerDatos(e) {
  postObj[e.target.name] = e.target.value
}

export function reiniciarObjeto(){
  postObj.imgUrlPostContent = ''
  postObj.imgUrlPostTiltle = ''
  postObj.tags = ''
  postObj.usuario = ''
  postObj.txtPost = ''
  postObj.titlePost = ''
}
