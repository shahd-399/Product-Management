let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submitBtn = document.getElementById('submit-btn');

let tableBody = document.getElementById('tableBody');

//get total
function getTotal(){
    if(price.value != ''){
        let res = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = res;
        total.classList.replace('btn-info','btn-primary');
    }
    else{
        total.innerHTML = '';
        total.classList.replace('btn-primary','btn-info');
    }
}

let myProducts
if(localStorage.getItem('list')!=null){
    myProducts = JSON.parse(localStorage.getItem('list'))
    displayData()
}
else
    myProducts = [];

    submitBtn.onclick = function() {
        addProduct();
        displayData();
    }

//add product
function addProduct(){
    let productObj ={
        title : title.value,
        price : price.value,
        taxes : taxes.value,
        ads : ads.value,
        discount : discount.value,
        total : total.innerHTML,
        count : count.value,
        category : category.value,
    }
    if(title.value != '' && category.value != '' && price.value != '' && +productObj.count < 100){
        if(+productObj.count > 1){
            for(let i=0; i<+productObj.count; i++){
                myProducts.push(productObj);
            }
        }
        else{
            myProducts.push(productObj);
        }
        localStorage.setItem('list',JSON.stringify(myProducts));
        clearForm();
    }
    else{
        if(+productObj.count >= 100){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "The Count of the Products Should Be Less Than 100",
            });
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Don't Forget Title, Category and Price",
            });
        }
    }
}

//clear inputs
function clearForm(){
        title.value = null;
        price.value = null;
        taxes.value = null;
        ads.value = null;
        discount.value = null;
        count.value = null;
        category.value = null;
        total.innerHTML = '';
        total.classList.replace('btn-primary','btn-info');
}


//show data
function displayData(arr=myProducts){
    getTotal();
    let table = '';

    for(let i=0; i < arr.length; i++){
        table += `
                <tr>
                        <th scope="row">${i+1}</th>
                        <td>${arr[i].title}</td>
                        <td>${arr[i].price}</td>
                        <td>${arr[i].taxes}</td>
                        <td>${arr[i].ads}</td>
                        <td>${arr[i].discount}</td>
                        <td>${arr[i].total}</td>
                        <td>${arr[i].category}</td>
                        <td>
                            <button type="button" class="btn btn-success" onclick="updateFunc(${i})">
                                Update
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" onclick="deleteFunc(${i})">
                            <i class="fa-solid fa-trash-can"></i>
                            Delete</button>
                        </td>
                    </tr>
        `
    }

    tableBody.innerHTML = table

    let deleteAll =document.getElementById("deleteAll");
    if(myProducts.length > 0){
        deleteAll.classList.replace('d-none','d-block');
        deleteAll.innerHTML=`Delete All ${myProducts.length}`
    }
    else{
        deleteAll.classList.replace('d-block','d-none');
    }
}

//delete data of the product
function deleteFunc(index){
    myProducts.splice(index,1);
    localStorage.setItem('list',JSON.stringify(myProducts))
    displayData();
}

//delete all products
function deleteAllFunc(){
    myProducts.splice(0)
    localStorage.clear();
    displayData();
}

//update data
let globalIndex;
let updateBtn = document.getElementById("update-btn");
function updateFunc(index){
    globalIndex = index;

    submitBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');

    title.value = myProducts[index].title;
    price.value = myProducts[index].price;
    taxes.value = myProducts[index].taxes;
    ads.value = myProducts[index].ads;
    discount.value = myProducts[index].discount;
    total.innerHTML = myProducts[index].total;
    getTotal();
    count.classList.add('d-none')
    category.value = myProducts[index].category;

    scroll({
        top:0,
        behavior:'smooth'
    });
}
updateBtn.addEventListener('click',function(){
    updateBtn.classList.add('d-none');
    submitBtn.classList.remove('d-none');

    myProducts[globalIndex].title = title.value;
    myProducts[globalIndex].price = price.value;
    myProducts[globalIndex].taxes = taxes.value;
    myProducts[globalIndex].ads = ads.value;
    myProducts[globalIndex].discount = discount.value;
    myProducts[globalIndex].total = total.innerHTML;
    count.classList.remove('d-none');
    myProducts[globalIndex].category = category.value;

    localStorage.setItem('list',JSON.stringify(myProducts))
    displayData();
    clearForm();
})


//search
let searchMood = 'title'
let search = document.getElementById('search');
function getSearchMood(id){
    if(id == "searchTitle"){
        searchMood = 'title'
        search.placeholder = 'Search By Title'
    }
    else{
        searchMood = 'category'
        search.placeholder = 'Search By Category'
    }
    search.focus();
    search.value='';
    displayData();
}

search.oninput = function(){
    let term = search.value.trim().toLowerCase();
    let searchArr = [];

    if(searchMood == 'title'){
        for(let i=0; i < myProducts.length; i++){
            if(myProducts[i].title.trim().toLowerCase().includes(term)){
                searchArr.push(myProducts[i]);
            }
        }
        displayData(searchArr);
    }
    else{
        for(let i=0; i < myProducts.length; i++){
            if(myProducts[i].category.trim().toLowerCase().includes(term)){
                searchArr.push(myProducts[i]);
            }
        }
        displayData(searchArr);
    }
}