<template>
  <div class="main my-6">
    <h1 class="is-size-2 has-text-centered mb-4 has-text-primary">
      WARUNGKU
    </h1>
    <div class="columns is-mobile is-centered is-multiline">
      <!-- modal -->
      <b-modal
        v-model="showModal"
        has-modal-card
        full-screen
        :can-cancel="false"
      >
        <div class="modal-card" style="width: auto">
          <section class="modal-card-body">
            <kasir-component
              :listProducts="listProducts"
              @close-modal="showModal = false"
              @update-list-products="updateListProducts($event)"
            ></kasir-component>
          </section>
        </div>
      </b-modal>

      <!-- column 7  table-->
      <div class="column is-10-mobile is-7-tablet is-7-desktop">
        <div class="box has-text-right">
          <div class="table-container">
            <table class="table is-fullwidth is-striped">
              <thead>
                <tr class="has-text-centered">
                  <th>product</th>
                  <th>qty</th>
                  <th>price</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(product, index) in listProducts"
                  :key="index"
                  class="has-text-centered"
                >
                  <td class="is-capitalized">{{ product.name }}</td>
                  <td>{{ product.qty }}</td>
                  <td>{{ product.price }}</td>
                  <td
                    class="is-flex is-flex-direction-row is-justify-content-center"
                  >
                    <b-button
                      type="is-primary"
                      size="is-small"
                      class="mr-1 mb-1"
                      icon-left="circle-edit-outline"
                      @click="edit(index)"
                    >
                      EDIT
                    </b-button>
                    <b-button
                      icon-left="delete"
                      type="is-dark"
                      size="is-small"
                      @click="dialog(index)"
                    >
                      DELETE
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <b-button
            class="mt-3"
            icon-left="currency-usd"
            type="is-success"
            @click="showModal = true"
            size="is-small"
          >
            KASIR MODE
          </b-button>
        </div>
      </div>

      <!-- column 3 form -->
      <div class="column is-10-mobile is-3-tablet is-3-desktop">
        <div class="box">
          <!-- alert -->
          <b-message
            :title="message.title"
            :type="message.type"
            size="is-small"
            v-model="message.active"
            aria-close-label="Close message"
          >
          </b-message>

          <form action="">
            <b-field label="PRODUCT">
              <b-input
                class="input-product-name"
                v-model="form.name"
                placeholder="product name"
                size="is-small"
              ></b-input>
            </b-field>
            <b-field label="QTY">
              <b-numberinput
                :controls="false"
                :min="0"
                placeholder="qty"
                v-model="form.qty"
                size="is-small"
              ></b-numberinput>
            </b-field>
            <b-field label="PRICE">
              <b-numberinput
                :controls="false"
                :min="0"
                placeholder="price"
                v-model="form.price"
                size="is-small"
              ></b-numberinput>
            </b-field>

            <b-button
              type="is-primary mr-1"
              class="mt-3"
              icon-left="plus"
              size="is-small"
              @click="addProduct"
            >
              {{ editOrAdd }}
            </b-button>
            <b-button
              icon-left="close"
              type="is-dark"
              class="mt-3"
              size="is-small"
              v-show="isEdit"
              @click="cancelEdit"
            >
              CANCEL UPDATE
            </b-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "kasir-component": () => import("./kasir"),
  },
  data() {
    return {
      form: { name: "", qty: 0, price: 0 },
      listProducts: [
        { name: "aqua", price: 2000, qty: 20 },
        { name: "tango", price: 1000, qty: 20 },
        { name: "mizone", price: 4000, qty: 20 },
        { name: "indomie", price: 2500, qty: 20 },
        { name: "taro", price: 1000, qty: 20 },
      ],
      isEdit: false,
      showModal: false,
      indexForEdit: null,
      message: {
        active: false,
        title: "New Product Added!",
        type: "is-primary",
      },
    };
  },
  methods: {
    deleteProduct(index) {
      this.listProducts.splice(index, 1);
    },
    edit(index) {
      this.isEdit = true;
      this.form = this.listProducts[index];
      this.indexForEdit = index;
    },
    cancelEdit() {
      this.isEdit = false;
      this.clearForm();
    },
    addProduct() {
      if (
        !this.form.name.length ||
        !this.form.qty > 0 ||
        !this.form.price > 0
      ) {
        this.displayAlert("All Field Required!", "is-warning");
        return;
      }

      // cek jika item sudah ada
      const cek = this.listProducts.filter(
        (e) => e.name.toLowerCase() === this.form.name.toLowerCase()
      );

      // jika nama product sudah ada
      // cek apakah isEdit aktif
      // jika iya ganti produk lama dgn product baru
      if (cek.length) {
        if (!this.isEdit) {
          this.displayAlert("Product Already Exist!", "is-warning");
          return;
        }

        // edit
        this.listProducts.splice(this.indexForEdit, 1, this.form);
        this.indexForEdit = null;
        this.isEdit = false;
        this.clearForm();
        this.displayAlert("Product Updated!", "is-success");
        return;
      }

      this.listProducts.push(this.form);
      this.isEdit = false;
      this.clearForm();
      this.displayAlert("Product added!", "is-success");

      // focus ke input product
      const input = document.querySelector(".input-product-name");
      input.querySelector("input").focus();
      this.message.active = true;

      return;
    },
    clearForm() {
      this.form = { name: "", qty: 0, price: 0 };
    },
    updateListProducts(data) {
      data.forEach((e) => {
        this.listProducts[e.index].qty = this.listProducts[e.index].qty - e.qty;
      });
      this.updateLocalStorage();
    },
    updateLocalStorage(data = this.listProducts) {
      const temp = JSON.stringify(data);
      localStorage.setItem("toko-products", temp);
      // console.log(localStorage.getItem("toko-products"));
    },
    dialog(index) {
      this.$buefy.dialog.confirm({
        title: "Confirm",
        message: `<p class='is-size-6'>
          Are you sure to delete product
          <span class="has-text-primary has-text-weight-bold">
          ${this.listProducts[index].name}
          </span>
          ?</p>`,
        confirmText: "YES",
        cancelText: "NO",
        type: "is-primary",
        size: "is-small",
        hasIcon: true,
        onConfirm: () => {
          setTimeout(() => {
            this.deleteProduct(index);
          }, 300);
        },
      });
    },
    displayAlert(title, type) {
      this.message.title = title;
      this.message.type = type;
      this.message.active = true;
    },
  },
  watch: {
    listProducts(newValue) {
      // console.log("watch berjalan");
      this.updateLocalStorage(newValue);
    },
  },
  computed: {
    editOrAdd() {
      return this.isEdit ? "UPDATE" : "PRODUCT";
    },
  },
  mounted() {
    if (localStorage.getItem("toko-products")) {
      this.listProducts = JSON.parse(localStorage.getItem("toko-products"));
    }
  },
};
</script>

<style scoped>
.table th:not([align]) {
  font-weight: 500;
  text-transform: uppercase;
}

.table th {
  width: fit-content;
}

div.modal-background,
.modal.is-full-screen > .animation-content > .modal-card {
  background-color: #f5f5f5 !important;
}

.modal-card-body {
  /* background-color: brown; */
}

@media print {
  .noprint {
    display: none;
  }
}
</style>
