<template>
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand-lg navbar-expand navbar-success navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>

<!--    &lt;!&ndash; SEARCH FORM &ndash;&gt;-->
<!--    <form class="form-inline ml-3">-->
<!--      <div class="input-group input-group-sm">-->
<!--        <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search">-->
<!--        <div class="input-group-append">-->
<!--          <button class="btn btn-navbar" type="submit">-->
<!--            <i class="fas fa-search"></i>-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->
  </nav>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped>
nav {
  z-index : -1;
}
</style>
