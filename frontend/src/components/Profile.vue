<template>
  <div v-if="currentUser" class="container-md">
    <header class="jumbotron mt-4" style="min-width: 350px;">
      <h1>Selamat datang <strong>{{ currentUser.username }}</strong>, di H8GroupConnect</h1>
      <h5 style="margin-top: 20px;"><a href="/home" class="flex items-center w-fit bg-primary px-6 py-2 text-white mt-4" style="padding-left: 1.5rem; padding-right: 1.5rem; border-radius: 9999px;">Klik disini</a> untuk melihat layanan kami</h5>
    </header>
    <div class="jumbotron mt-4" style="background-color:cornflowerblue; min-width: 350px;">
      <h3 class="text-hist ml-2"><strong> Riwayat Ulasan </strong></h3>
      <div class="container-lg mt-4">
        <div class="list row d-flex flex-wrap wrap mw-100">
          <div class="col-md-4" v-for="(currentHistory, index) in ulasanshist.filter(hist => hist.layanan !== null)" :key="index">
            <div class="card mb-3">
              <div class="card-body" style="min-height: 300px;">
                <h5 class="card-title">Ulasan {{ index + 1 }}</h5>
                <p v-if="currentHistory.layanan" class="card-text">Layanan: {{ currentHistory.layanan.title }}</p>
                <div class="rating">
                <label class="card-text">Nilai: </label>
                <span class="star-rating" style="color: gold;">
                  <span v-for="n in Math.round(currentHistory.rating)" :key="n" class="star" style="font-size: 1.1rem;">★</span>
                </span>
                </div>
                <p class="card-text">Ulasan: {{ currentHistory.ulasan }}</p>
                <button class="btn btn-info mr-1" @click="showEditModal(currentHistory)">Ubah</button>
                <button class="btn btn-danger" @click="showDeleteModal(currentHistory)">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Redirecting to login...</p>
  </div>

  <div v-if="showDeleteModalFlag" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Hapus Ulasan</h5>
          <button type="button" class="close" aria-label="Close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah anda yakin untuk menghapus ulasan ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="confirmDelete">Hapus</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showEditModalFlag" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ubah Ulasan</h5>
          <button type="button" class="close" aria-label="Close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="newUlasanText">Ulasan</label>
            <textarea id="newUlasanText" class="form-control" v-model="newUlasanText"></textarea>
          </div>
          <div class="form-group">
            <label for="newUlasanRating">Nilai</label>
            <input id="newUlasanRating" class="form-control" type="number" v-model="newUlasanRating" min="0" max="5"/>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="confirmEdit">Simpan</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth.module';
import { useUlasanStore } from '@/store/ulasanstore';
import { mapStores } from 'pinia';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default {
  name: 'Profile',
  data() {
    return {
      showDeleteModalFlag: false,
      showEditModalFlag: false,
      ulasanToDelete: null,
      ulasanToEdit: null,
      newUlasanText: '',
      newUlasanRating: 0,
    };
  },
  computed: {
    ...mapStores(useAuthStore, useUlasanStore),
    currentUser() {
      const authStore = useAuthStore();
      return authStore.user;
    },
    ulasanshist() {
      const ulasanStore = useUlasanStore();
      return ulasanStore.ulasanshist;
    },
  },
  methods: {
    async getHistory() {
      const authStore = useAuthStore();
      if (authStore.user) {
        await this.ulasanStore.historyUlasan(authStore.user.id);
      }
    },
    showDeleteModal(currentHistory) {
      this.ulasanToDelete = currentHistory.layanan.id;
      this.showDeleteModalFlag = true;
      console.log(this.authStore.user.id)
      console.log(this.ulasanToDelete)
    },
    showEditModal(currentHistory) {
      this.ulasanToEdit = currentHistory.layanan.id;
      this.newUlasanText = currentHistory.ulasan;
      this.newUlasanRating = currentHistory.rating;
      this.showEditModalFlag = true;
      
    },
    closeModal() {
      this.showDeleteModalFlag = false;
      this.showEditModalFlag = false;
      this.ulasanToDelete = null;
      this.ulasanToEdit = null;
      this.newUlasanText = '';
      this.newUlasanRating = 0;
    },
    async confirmDelete() {
      if (this.ulasanToDelete) {
        await this.ulasanStore.deleteUlasan(this.authStore.user.id,this.ulasanToDelete);
        this.showToast(this.ulasanStore.message, this.ulasanStore.error);
        this.closeModal();
        this.getHistory(); // Refresh the history list
      }
    },
    async confirmEdit() {
      if (this.ulasanToEdit) {
        const updatedUlasan = {
          userId: this.currentUser.id,
          ulasan: this.newUlasanText,
          rating: this.newUlasanRating,
        };
        await this.ulasanStore.updateUlasan(this.ulasanToEdit, updatedUlasan);
        this.showToast(this.ulasanStore.message, this.ulasanStore.error);
        this.closeModal();
        this.getHistory(); // Refresh the history list
      }
    },
    showToast(message, isError) {
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: isError ? "linear-gradient(to right, #ff5f6d, #ffc371)" : "linear-gradient(to right, #8e7cc3, #96c93d)",
      }).showToast();
    },
  },
  watch: {
    currentUser(newVal) {
      if (!newVal) {
        this.$router.push('/login');
      }
    },
  },
  mounted() {
    const authStore = useAuthStore();
    if (!authStore.user) {
      this.$router.push('/login');
    } else {
      this.getHistory();
    }
  },
};
</script>