<template>
  <div class="home">
    <MenuComponent></MenuComponent>
    <BannerComponent></BannerComponent>
    <article class="content-card">
      <CardComponent v-for="moto in motos" :key="moto.name" :imagen="require(`../assets/${moto.nameImage}`)" :nombre="moto.name" :parrafo="moto.parragraf"></CardComponent>
    </article>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data(){
    return{
      motos: [
        {
          nameImage:  "card-1.jpg",
          name: "Name 1",
          parragraf: "Parrafo 1"
        },
        {
          nameImage:  "card-2.jpg",
          name: "Name 2",
          parragraf: "Parrafo 2"
        },
        {
          nameImage:  "card-3.jpg",
          name: "Name 3",
          parragraf: "Parrafo 3"
        }
      ]
    }
  },
  components: {

  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content-card{
    width: 80%;
    height: 350px;
    margin: 1rem auto;
    gap: 2.5rem;
    display: flex;
}

</style>