<template>
  <div id="app">
    <nav class="navbar navbar-expand" style="background-color: rgba(150,30,40, 0.8); max-width: 100%; min-width: 500px;">
      <div class="navbar-nav mr-auto">
        <router-link to="/home">
          <div style="font-size: x-large; color: white">
          <i class="fas fa-home-lg"></i>
          </div>
        </router-link>
        <li class="nav-item" v-if="currentUser">
          <router-link to="/home" class="nav-link" style="color: azure;">
           H8GroupConnect
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin/edit" class="nav-link ml-3 text-white" style="font-size: larger;font-family: Arial, Helvetica, sans-serif;"> Ubah </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link v-if="showAdminBoard" to="/admin/add" class="nav-link text-white" style="font-size: larger;font-family: Arial, Helvetica, sans-serif;">Tambah</router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link v-if="showAdminBoard" to="/admin/delete" class="nav-link text-white" style="font-size: larger;font-family: Arial, Helvetica, sans-serif;">Hapus</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav nav-pills ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link" active-class="active">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" style="color: beige;">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="showLogoutModal" style="color: bisque;">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container-fluid">
      <router-view />
    </div>
    <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Logout</h5>
            <button type="button" class="close" aria-label="Close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Apakah Anda yakin ingin keluar?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
            <button type="button" class="btn btn-danger" @click="confirmLogout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth.module';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();

    const currentUser = computed(() => authStore.user);
    const showAdminBoard = computed(() => currentUser.value && currentUser.value.roles && currentUser.value.roles.includes('ROLE_ADMIN'));
    const showModeratorBoard = computed(() => currentUser.value && currentUser.value.roles && currentUser.value.roles.includes('ROLE_MODERATOR'));
    const router = useRouter();
    const showModal = ref(false);

    const showLogoutModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };
    const confirmLogout = () => {
      authStore.logout();
      closeModal();
      setTimeout(() => {
        router.push('/login');
      }, 1000); 
    };
    onMounted(() => {
      if (!currentUser.value) {
        router.push('/login');
      }
    });
    return {
      currentUser,
      showAdminBoard,
      showModeratorBoard,
      showModal,
      showLogoutModal,
      closeModal,
      confirmLogout,
    };
  },
};
</script>

<style>
#app {
  width: 100%;
}
.nav-item {
  --clr: rgb(247, 197, 159);
  --clr-alpha: rgb(247, 197, 159, 0.1);
  animation: spinner 1.6s infinite ease;
  transform-style: preserve-3d;
}
.nav-link:hover {
  transform: translateX(10px);
  opacity: 0.9;
}
</style>
