const BASE_URL = "https://68b2bc9ac28940c9e69d39e3.mockapi.io";

let FetchListTodo = () => {
  axios({
    method: "GET",
    url: `${BASE_URL}/todos`,
  })
    .then((result) => {
      console.log(result);

      let List = result.data;
      todos = result.data;

      RenderList(List);
    })
    .catch((err) => {
      console.error("Có lỗi:", err.message);
    });
};

FetchListTodo();

let RenderList = (todos) => {
  let contentHTML = "";

  todos.forEach((todo) => {
    let { id, name, price, img, desc } = todo;
    contentHTML += `<tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${price}</td>
                <td><img src="${img}" width="100"></td>
                <td>${desc}</td>
                <td>
                <button onclick="deleteTodo(${id})" class="btn btn-info">DELETE</button>
                <button onclick="editTodo(${id})" data-bs-toggle="modal" data-bs-target="#phoneModal" class="btn btn-warning">EDIT</button>
                </td>
                


            </tr>`;
  });
  document.querySelector("tbody").innerHTML = contentHTML;
};

let deleteTodo = (idTodo) => {
  let apiURL = `${BASE_URL}/todos/${idTodo}`;
  axios({
    method: "DELETE",
    url: apiURL,
  })
    .then((result) => {
      FetchListTodo();

    })
    .catch((err) => {});
};

let createTodo=() => {
    const name = document.getElementById('name').value ;
    const price = document.getElementById('price').value ;
    const screen = document.getElementById('screen').value ;
    const backCamera = document.getElementById('backCamera').value ;
    const frontCamera = document.getElementById('frontCamera').value ;
    const img = document.getElementById('img').value ;
    const desc = document.getElementById('desc').value ;
    const type = document.getElementById('type').value ;
    axios({
        method:'post',
        url: `${BASE_URL}/todos`,
        data: {
            name:name,
            price:price,
            screen:screen,
            backCamera:backCamera,
            frontCamera:frontCamera,
            img:img,
            desc:desc,
            type:type,
            
        }
    })
    .then((result) => {
        FetchListTodo();
        
        
    }).catch((err) => {
        
    });
  
}
let idEdit=null;
let editTodo=(idTodo) => {
     idEdit=idTodo;
    console.log(idTodo);
    axios({
        method:'GET',
        url: `${BASE_URL}/todos/${idTodo}`,
        
    })
    .then((result) => {
        document.getElementById('name').value= result.data.name;
    document.getElementById('price').value=result.data.price ;
    document.getElementById('screen').value =result.data.screen;
    document.getElementById('backCamera').value=result.data.backCamera ;
    document.getElementById('frontCamera').value=result.data.frontCamera ;
    document.getElementById('img').value=result.data.img ;
    document.getElementById('desc').value=result.data.desc ;
    document.getElementById('type').value=result.data.type ;
        
    }).catch((err) => {
        
    });
    
}

let saveUpdate=() => {
    let name = document.getElementById('name').value ;
    let price = document.getElementById('price').value ;
    let screen = document.getElementById('screen').value ;
    let backCamera = document.getElementById('backCamera').value ;
    let frontCamera = document.getElementById('frontCamera').value ;
    let img = document.getElementById('img').value ;
    let desc = document.getElementById('desc').value ;
    let type = document.getElementById('type').value ;
    axios({
        method:'PUT',
        url: `${BASE_URL}/todos/${idEdit}`,
        data: {
            name:name,
            price:price,
            screen:screen,
            backCamera:backCamera,
            frontCamera:frontCamera,
            img:img,
            desc:desc,
            type:type,
        }
    })
    .then((result) => {
        FetchListTodo();
        
    }).catch((err) => {
        
    });
  
}

















