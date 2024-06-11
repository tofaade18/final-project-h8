<template>
  <div class="list row">
    <div class="filter-container mt-2">
      <div class="d-flex align-items-start justify-content-start" style="width: 100%;">
        <div class="rounded bg-secondary p-3 mb-3" style="min-width: 400px;" >
          <div class="container-fluid d-flex p-0">
            <div class="d-flex rounded-start border-end border-dark bg-light">
              <svg viewBox="0 0 20 20" aria-hidden="true" class="pointer-events-none w-5 fill-gray-500">
                <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
              </svg>
            </div>
            <select class="form-select mr-1" v-model="selectedFilter" @change="updateSelectedFilter">
              <option value="" disabled selected>Select Filter</option>
              <option v-for="(filter, index) in filterOptions" :key="index" :value="filter">{{ filter }}</option>
            </select>
            <input type="text" class="form-control bg-light p-2 flex-grow-1 border-0" placeholder="Search" v-model="searchText" />
            <button class="btn btn-primary rounded-end p-1 ml-1" type="button" @click="searchTitle" style="height: 39px;">Search</button>
            <select class="form-select ml-2" v-model="selectedSortOption" @change="sortLayanans" style="width: 125px;">
              <option value="" disabled selected>Sort by</option>
              <option value="title">Sort by Title</option>
              <option value="averageRating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="menu-layanans">
    <h4 class="menu ml-5">Menu Layanan</h4>
    <div class="list-group">
      <div class="list-group-item" v-for="(layanan, index) in displayedLayanans" :key="index">
        <div class="photo">
          <img class="photos" :src="layanan.linkImg" alt="Farmasi Image" />
        </div>
        <div class="title" style="text-align: center; margin-bottom: 10px">
          <strong>{{ layanan.title }}</strong>
        </div>
        <div>
          <label><strong>Description:</strong></label> {{ layanan.description }}
        </div>
        <div>
          <label><strong>Alamat:</strong></label> {{ layanan.alamat }}
        </div>
        <div class="rating">
          <label><strong>Rating:</strong></label>
          <span v-if="layanan.averageRating > 0" class="star-rating" style="color: gold;">
            <span v-for="n in Math.round(layanan.averageRating)" :key="n" class="star" style="font-size: 1.5rem;">★</span>
          </span>
          <span v-else> No reviews yet</span>
        </div>
        <div>
          <label><strong>Jenis:</strong></label> {{ layanan.jenis }}
        </div>
        <div v-if="currentUser">
          <router-link :to="'/details/' + layanan.id" class="badge badge-warning" style="display: flex; justify-content: center;">Details</router-link>
        </div>
      </div>
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: !layananStore || layananStore.currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !layananStore || layananStore.currentPage === layananStore.totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useLayananStore } from '@/store/layananstore';
import { useAuthStore } from '@/store/auth.module';
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

export default {
  name: "layanans-list",
  setup() {
    const layananStore = useLayananStore();
    const authStore = useAuthStore();

    const selectedFilter = ref('');
    const selectedSortOption = ref('');
    const searchText = ref("");

    const currentUser = computed(() => authStore.user);
    const filterOptions = computed(() => ["alamat", "title", "jenis"]);
    const paginatedLayanans = computed(() => layananStore.layanans.slice(0, 6));
    const currentPage = computed(() => layananStore.currentPage);
    const totalPages = computed(() => layananStore.totalPages);
    const { layananall } = storeToRefs(layananStore);
    const filteredLayanans = computed(() => {
      let layanans = layananall.value;
      // Apply sorting
      if (selectedSortOption.value === "title") {
        layanans.sort((a, b) => a.title.localeCompare(b.title));
      } else if (selectedSortOption.value === "averageRating") {
        layanans.sort((a, b) => b.averageRating - a.averageRating);
      }
      return layanans;
    });

    const searchTitle = async () => {
      await layananStore.searchTitle(searchText.value, selectedFilter.value);
    };

    const updateSelectedFilter = () => {
      layananStore.updateSelectedFilter(selectedFilter.value, searchText.value);
    };

    const sortLayanans = () => {
      layananStore.sortLayanans(selectedSortOption.value);
    };

    const changePage = (page) => {
      layananStore.changePage(page);
    };

    const nextPage = () => {
      if (layananStore.currentPage < layananStore.totalPages) {
        layananStore.nextPage();
      }
    };

    const prevPage = () => {
      if (layananStore.currentPage > 1) {
        layananStore.prevPage();
      }
    };

    const displayedLayanans = computed(() => {
      const startIndex = (currentPage.value - 1) * 6;
      return filteredLayanans.value.slice(startIndex, startIndex + 6);
    });

    onMounted(() => {
      layananStore.PaginatedLayanan();
      layananStore.AllLayanan();
    });

    return {
      selectedFilter,
      selectedSortOption,
      searchText,
      filterOptions,
      paginatedLayanans,
      filteredLayanans,
      currentUser,
      currentPage,
      totalPages,
      layananall,
      searchTitle,
      updateSelectedFilter,
      sortLayanans,
      changePage,
      nextPage,
      prevPage,
      displayedLayanans,
      layananStore
    };
  },
};
</script>

<style scoped>
#background {
  position: absolute;
  opacity: 0.4;
  align-items: center;
}
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.list-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.list-group-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin: 20px;
  margin-left: 40px;
  width: 280px;
}
.photo {
  display: flex;
  justify-content: center;
}
.photos {
  width: 200px;
  height: 200px;
}
button::after {
  pointer-events: none;
  content: "";
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--glow-spread-color);
  filter: blur(2em);
  opacity: 0.7;
  transform: perspective(1.5em) rotateX(35deg) scale(0.9, 1) translateY(10%);
}
.menu {
  display: flex;
  justify-content: flex-start;
  font-family: inherit;
  font-size: 24px;
}
</style>