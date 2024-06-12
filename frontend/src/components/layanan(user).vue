<template>
  <div v-if="currentLayanan" style="margin: 30px; max-width: 100%;">
    <h4>{{ currentLayanan.title }}</h4>
    <i class="fas fa-phone-alt">⠀{{ currentLayanan.phone }}</i>
    <img :src="currentLayanan.linkImg" alt="Image" class="photos" style="height: 200px; width: 200px; display: flex; align-items: center">
  </div>
  <div v-if="currentLayanan" class="edit-form" style="margin: 30px;">
    <form class="container-fluid-xl">
      <div class="list row mt-3 ml-0 mb-2 mw-100">
        <div class="col-lg-4">
          <div class="form-group">
            <label for="ulasan"><strong>Ulasan :</strong></label>
            <textarea type="text" class="form-control" id="ulasan" v-model="newUlasanText" />
          </div>
          <div class="form-group">
            <label for="rating"><strong>Nilai :</strong></label>
            <input type="number" class="form-control" id="rating" v-model.number="newUlasanRating" min="1" max="5" />
          </div>
          <div class="field">
            <button type="button" class="button is-info mt-2" style="border-radius: 0.5rem; width: 30%;" @click="processUlasan">Kirim</button>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="form-group">
            <label for="rating"><strong>Komentar :</strong></label>
            <ul>
              <li v-for="review in currentLayanan.ul" :key="review.id">
                <div class="review-item ml-2" style="display: flex; align-items: baseline;">
                  <div class="review-content">
                    <div class="user-anon mb-1">
                    <i class="fas fa-circle-user"></i>
                    {{ review.user.username }}
                    </div>
                    <div class="review-text-box mt-1">
                      <p>{{ review.ulasan }}</p>
                    </div>
                  </div>
                  <button type="button" class="delete-button ml-4" v-if="currentUser && review.user.id === currentUser.id" @click="showDeleteModal(review.id)">×</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="form-group">
            <label for="rating"><strong>Nilai :</strong></label>
            <ul>
              <li v-for="review in currentLayanan.ul" :key="review.id">
                <div class="user-anon">
                <i class="fas fa-circle-user"></i>
                {{ review.user.username }}
                </div>
                <div class="star-rating">
                  <span v-for="n in review.rating" :key="n" class="star">★</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
    </div>

  <div v-else>
    <br />
    <p>Please login first...</p>
  </div>
  <div v-if="showModal" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Delete</h5>
          <button type="button" class="close" aria-label="Close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this review?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth.module';
import { useLayananStore } from '@/store/layananstore';
import { useUlasanStore } from '@/store/ulasanstore';
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default {
  name: "ulasans-list",
  setup() {
    const authStore = useAuthStore();
    const layananStore = useLayananStore();
    const ulasanStore = useUlasanStore();
    const route = useRoute();
    const router = useRouter();

    const currentLayanan = computed(() => layananStore.currentLayanan);
    const error = computed(() => ulasanStore.error);
    const message = computed(() => ulasanStore.message);
    const currentUser = computed(() => authStore.user);
    const newUlasanText = ref("");
    const newUlasanRating = ref(0);
    const showModal = ref(false);
    const ulasanToDelete = ref(null);
    const isSubmitting = ref(false);

    const processUlasan = async () => {
      if (isSubmitting.value) {
        return;
      }
      isSubmitting.value = true;
      try {
        const existingReview = currentLayanan.value.ul.find(review => review.user.id === (currentUser.value ? currentUser.value.id : null));
      if (existingReview) {
        await updateUlasan();
      } else {
        await addUlasan();
      }
      } finally {
        isSubmitting.value = false
      }
    };

    const addUlasan = async () => {
      if (!newUlasanText.value || !isValidRating(newUlasanRating.value)) {
        showToast('Error value, please enter a right value', true);
        return;
      }
      const data = {
        userId: authStore.user.id,
        ulasan: newUlasanText.value,
        rating: newUlasanRating.value,
      };
      await ulasanStore.addUlasan(route.params.id, data);
      showToast(ulasanStore.message, ulasanStore.error);
      newUlasanText.value = "";
      newUlasanRating.value = 0;
      ulasanStore.getUlasan(route.params.id);
      layananStore.getLayanan(route.params.id);
    };

    const updateUlasan = async () => {
      if (!newUlasanText.value || !isValidRating(newUlasanRating.value)) {
        showToast('Error value, please enter a right value', true);        return;
      }
      const data = {
        userId: authStore.user.id,
        ulasan: newUlasanText.value,
        rating: newUlasanRating.value,
      };
      await ulasanStore.updateUlasan(route.params.id, data);
      showToast(ulasanStore.message, ulasanStore.error);
      newUlasanText.value ="";
      newUlasanRating.value = 0;
      ulasanStore.getUlasan(route.params.id);
      layananStore.getLayanan(route.params.id);
    };
    const isValidRating = (rating) => {
      return [0, 1, 2, 3, 4, 5].includes(rating);
    };
    const showDeleteModal = (ulasanId) => {
      ulasanToDelete.value = ulasanId;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      ulasanToDelete.value = null;
    };
    const confirmDelete = async () => {
      await ulasanStore.deleteUlasan(authStore.user.id, route.params.id);
      showToast(ulasanStore.message, ulasanStore.error);
      closeModal();
      ulasanStore.getUlasan(route.params.id);
      layananStore.getLayanan(route.params.id);
    };
    const showToast = (message, isError) => {
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: isError ? "linear-gradient(to right, #ff5f6d, #ffc371)" : "linear-gradient(to right, #8e7cc3, #96c93d)",
      }).showToast();
    };

    const clearMessage = () => {
      ulasanStore.message = '';
    };

    onMounted(() => {
      if (!currentUser.value) {
        router.push('/login');
      }
      ulasanStore.getUlasan(route.params.id);
      layananStore.getLayanan(route.params.id);
    });

    return {
      currentLayanan,
      error,
      message,
      newUlasanText,
      newUlasanRating,
      showModal,
      ulasanToDelete,
      currentUser,
      isSubmitting,
      processUlasan,
      addUlasan,
      updateUlasan,
      showDeleteModal,
      closeModal,
      confirmDelete,
      clearMessage,
    };
  },
  beforeRouteLeave(to, from, next) {
    this.clearMessage();
    next();
  }
};
</script>

<style scoped>

.photos {
  object-fit: cover;
  border-radius: 10px;
  margin: 5px;
}
.modal.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Darken the background */
}
.modal-card {
  width: 500px;
  max-width: 100%;
  background-color: white; /* Ensure modal content is visible */
  border-radius: 8px; /* Slightly rounded corners */
  overflow: hidden; /* Hide overflowing content */
}

.modal-card-head, .modal-card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px; /* Add padding */
  background-color: #f5f5f5; /* Light background for header and footer */
}

.modal-card-body {
  padding: 20px; /* Add padding to the body */
}

.modal-card-title {
  font-size: 1.25em; /* Increase title size */
  font-weight: bold; /* Make title bold */
}

.delete {
  background: none;
  border: none;
  font-size: 1.5em; /* Increase the size of the close button */
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
}

.button.is-info {
  background-color: #209cee;
  color: white;
}
.review-text-box {
  position: relative;
  margin-bottom: 10px;
}

/* Styles for the rating with stars */
.star-rating {
  color: gold; /* Color of the stars */
}

.star {
  font-size: 1.5em; /* Size of the stars */
}
.delete-button {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 1.2em;
  cursor: pointer;
}
</style>