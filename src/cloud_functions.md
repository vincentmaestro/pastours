<!-- push to database -->

products.carbonatedDrinks.map(product => {
    addDoc(collection(db, 'beverages', 'items', 'carbonatedDrinks'), product)
    .then(() => console.log('product added'))
    .catch(error => console.log(error));
});

<!-- Retrieve items -->

const items = await getDocs(collection(db, 'provisions', 'items', 'butter'));
items.forEach(item => console.log(item.id, '=>', item.data()));

<!-- fetch from local, push to cloud -->

fetch('http://localhost:8000/promotions')
    .then(promos => promos.json())
    .then(promos => {
        setPromos(promos);
        promosRef.current.childNodes[0].classList.add('current-slide');
        console.log(promos);
        setDoc(doc(db, 'promotions', 'premiumPromotions'), promos[5])
        .then(() => console.log('product added'))
        .catch((error) => console.log(error));
    });