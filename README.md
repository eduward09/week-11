# Weekly Assignments for Week-11

**API**

Requirements : 
1. CRUD:
- show all stock of products name
- add products name
- add incoming stock
- delete stock
2. User Register & Authentication:
- add username & password
3. Login
4. User Role
- add user role as "creator" & "reader"

Contratcts :

```json
POST /register : add username & password

{
    "username": "andi",
    "password": "test123",
    "email": "andi@user.com",
    "role": "user"
}

{
    "message": "Registration successful"
}
```

```json
POST /login : user login

{
    "username": "andi",
    "password": "test123"
}

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTY5MzQ0OTM5OSwiZXhwIjoxNjkzNDUyOTk5fQ.gAkCXK-RH71ylhxopNEHbkABioMmSK_KDF-Uc79-44k"
}
```

```json
GET /datas : show all stock of the products name

{
    "success": true,
    "data": [
        {
            "id": 1,
            "nama_barang": "komputer",
            "merek": "intel"
        },

        {
            "id": 2,
            "nama_barang": "monitor",
            "merek": "samsung"
        }
    ],
}
```

```json
GET /datas/in : show all incoming stock
{
    "success": true,
    "data": [
        {
            "id": 1,
            "id_barang": 1,
            "nama_barang": "komputer",
            "jumlah": 4
        },
        {
            "id": 2,
            "id_barang": 2,
            "nama_barang": "keyboard",
            "jumlah": 3
        }
    ]
}
```

```json
GET /datas/:id : show inventory stock by ID
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nama_barang": "komputer",
            "merek": "intel",
            "total_stok": "4"
        }
    ]
}
```

```json
POST /datas/stok : add stock of products name 
{
    "nama_barang": "printer",
    "merek": "brother"
}

{
    "success": true,
    "data": {
        "id": 7
    }
}
```

```json
POST /datas/stok/in : add incoming stock
{
    "id_barang": 7,
    "jumlah": 1,
    "nama_barang": "printer"
}

{
    "success": true,
    "data": {
        "id": 4
    }
}
```

```json
DELETE /datas/stok/:id : delete incoming stock by ID
{
    "success": true,
    "data": {
        "id": "4"
    }
}
```