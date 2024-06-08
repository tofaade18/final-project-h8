import { defineStore } from 'pinia';
import LayananDataService from '../services/LayananDataservice';

export const useLayananStore = defineStore('layanan', {
  state: () => ({
    currentLayanan: null,
    layanans: [],
    message: '',
    currentPage: 1,
    totalPages: 1,
    layananall: [],
    sortOption: 'title'
  }),
  actions: {
    async getLayanan(id) {
      try {
        const response = await LayananDataService.get(id);
        this.currentLayanan = response.data;
        console.log(this.currentLayanan)
        console.log(this.currentLayanan.ul[0].user.id)
      } catch (e) {
        console.error(e);
      }
    },
    async updateLayanan(data) {
      try {
        const response = await LayananDataService.update(this.currentLayanan.id, data);
        this.currentLayanan = response.data;
        this.message = 'Layanan was updated successfully!';
      } catch (e) {
        console.error(e);
      }
    },
    async PaginatedLayanan() {
      try {
        const response = await LayananDataService.paginated(this.currentPage);
        this.layanans = response.data.services;
        this.totalPages = response.data.totalPages;
      } catch (e) {
        console.error(e);
      }
    },
    async AllLayanan() {
      try {
        // Initialize currentPage to 1 before starting to paginate through all pages
        this.currentPage = 1;
        this.layananall = [];
        
        while (this.currentPage <= this.totalPages) {
          const response = await LayananDataService.paginated(this.currentPage);
          this.layananall = this.layananall.concat(response.data.services);
          this.totalPages = response.data.totalPages;
          this.currentPage++;
        }
        console.log("response",this.layananall)
        
        // Reset currentPage after fetching all data
        this.currentPage = 1;
      } catch (e) {
        console.error(e);
      }
    },
    async changePage(page) {
      try {
        console.log('changePage method called with page:', page);
        this.currentPage = page;
        await this.PaginatedLayanan();
      } catch (e) {
        console.log(e);
      }
    },
    async nextPage() {
      try {
        if (this.currentPage < this.totalPages) {
          console.log('nextPage method called');
          this.currentPage++;
          await this.PaginatedLayanan();
        }
      } catch (e) {
        console.log(e);
      }
    },
    async prevPage() {
      try {
        if (this.currentPage > 1) {
          console.log('prevPage method called');
          this.currentPage--;
          await this.PaginatedLayanan();
        }
      } catch (e) {
        console.log(e);
      }
    },
    async searchTitle(searchText, selectedFilter) {
      try {
        const response = await LayananDataService.findBy(searchText, selectedFilter);
        this.layananall = response.data.services;
        console.log(this.layananall)
      } catch (e) {
        console.log(e);
      }
    },
    async updateSelectedFilter(selectedFilter, searchText) {
      console.log(selectedFilter)
      if (selectedFilter === "title") {
        this.layananall = this.layananall.filter(layanan => layanan.title.toLowerCase().includes(searchText.toLowerCase()));
      } else {
        this.layananall = this.layananall.filter(layanan => layanan[selectedFilter].toLowerCase().includes(searchText.toLowerCase()));
      }
    },
    sortLayanans(sortOption) {
      this.sortOption = sortOption;
      if (sortOption === 'title') {
        this.layanans.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === 'averageRating') {
        this.layanans.sort((a, b) => b.averageRating - a.averageRating);
      }
    }
  }
});
