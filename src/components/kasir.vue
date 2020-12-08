<template>
  <div class="kasir">
    <div class="columns my-0 mx-0 is-centered">
      <div class="column is-10 px-0 py-0">
        <div class="box has-text-centered">
          <div class="close-btn-wrapper has-text-left noprint">
            <b-button
              size="is-small"
              type="is-dark"
              icon-left="close"
              class="mb-5"
              @click="closePage"
            >
              CLOSE
            </b-button>
          </div>

          <h1 class="has-text-primary is-size-4">WARUNGKU</h1>
          <p class="is-italic is-size-7 mb-4">
            jl. indonesia raya no.45, Indonesia
          </p>
          <div class="tanggal has-text-right is-size-7 mb-2">
            <p>{{ tanggal }}</p>
          </div>

          <!-- alert -->
          <b-message
            class="mb-1"
            :title="message.title"
            :type="message.type"
            size="is-small"
            v-model="message.active"
            aria-close-label="Close message"
          >
          </b-message>

          <div class="table-container">
            <table class="table is-fullwidth">
              <thead class="has-text-centered">
                <tr>
                  <th class="has-text-left">product</th>
                  <th>qty</th>
                  <th>@price</th>
                  <th>price</th>
                  <th class="th-action noprint">action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in basket" :key="index">
                  <td>
                    <b-input
                      placeholder="poduct name"
                      class="product"
                      size="is-small"
                      v-model="item.product"
                      @input="getProduct($event, index)"
                    ></b-input>
                  </td>

                  <td>
                    <b-numberinput
                      :controls="false"
                      :min="1"
                      class="qty"
                      size="is-small"
                      v-model="item.qty"
                      @blur="changeSubTotal($event, index)"
                    ></b-numberinput>
                  </td>

                  <td>
                    <b-numberinput
                      :controls="false"
                      size="is-small"
                      placeholder="0"
                      class="@price"
                      v-model="item.price"
                      disabled
                    ></b-numberinput>
                  </td>

                  <td>
                    <b-numberinput
                      :controls="false"
                      size="is-small"
                      placeholder="0"
                      class="price"
                      v-model="item.subTotal"
                      disabled
                    ></b-numberinput>
                  </td>

                  <!-- del-button -->
                  <td class="noprint">
                    <b-button
                      class="action"
                      type="is-dark"
                      icon-left="minus"
                      size="is-small"
                      @click="delFromBasket(index)"
                    >
                      {{ deleteOrClear }}
                    </b-button>
                  </td>
                </tr>

                <!-- total row -->
                <tr class="has-text-centered has-text-weight-semi-bold py-6">
                  <td colspan="3">TOTAL</td>
                  <td>{{ total }}</td>
                </tr>
              </tbody>
            </table>

            <!-- add button & print button -->
            <div class="action-buttons has-text-left noprint">
              <b-button
                type="is-primary"
                size="is-small"
                icon-left="plus"
                class="mb-1"
                @click="newBasket"
              >
                PRODUCT
              </b-button>

              <br />

              <b-button
                type="is-success"
                size="is-small"
                icon-left="cart"
                class="mb-1"
                @click="checkOut"
              >
                CHECKOUT
              </b-button>

              <br />

              <b-button
                type="is-danger"
                size="is-small"
                icon-left="autorenew"
                class="mb-1"
                @click="clearBasket"
              >
                CLEAR ALL
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      basket: [{ product: "", qty: 0, price: 0, subTotal: 0 }],
      message: {
        active: false,
        title: "New Product Added!",
        type: "is-primary",
      },
    };
  },
  methods: {
    getProduct(event, index) {
      const product = this.listProducts.filter((product) => {
        return (
          product.name.toLowerCase() ===
          this.basket[index].product.toLowerCase()
        );
      });

      if (product.length === 1) {
        // jika product kosong
        if (product[0].qty < 1) {
          this.displayAlert("product out of stock!", "is-primary");

          // set qty input menjadi disable
          const qty = document.querySelectorAll(".qty");
          qty[index].querySelector("input").disabled = true;
          return;
        }

        this.basket[index].qty = 1;
        this.basket[index].price = product[0].price;
        this.basket[index].subTotal = product[0].price;
      } else {
        this.clearRow(index);
      }
    },
    clearRow(index) {
      this.basket[index].qty = 0;
      this.basket[index].price = 0;
      this.basket[index].subTotal = 0;
    },
    newBasket() {
      this.basket.push({ product: "", qty: 0, price: 0, subTotal: 0 });
      this.focusToEl();
    },
    changeSubTotal(event, index) {
      const value = event.target.value;
      this.basket[index].subTotal = value * this.basket[index].price;
    },
    delFromBasket(index) {
      if (this.basket.length === 1) {
        this.clearBasket();
        return;
      }

      this.basket.splice(index, 1);
    },
    checkOut() {
      // check jika product yang ingin dibeli kosong
      const cek = this.basket.filter((e) => e.qty < 1);

      if (cek.length) {
        this.displayAlert("Qty Field Can't Be 0!", "is-warning");
        return;
      } else {
        // cek jika qty product yang di beli lebih besar dari stock
        let cekStock = true;

        for (let i = 0; i < this.basket.length; i++) {
          const item = this.basket[i];

          for (let j = 0; j < this.listProducts.length; j++) {
            const product = this.listProducts[j];

            if (item.product.toLowerCase() === product.name.toLowerCase()) {
              if (product.qty - item.qty < 0) {
                cekStock = false;
                break;
              }
            }
          }
        }

        // console.log(cekStock);
        // jika stock cukup jalankan fungsi
        if (cekStock) {
          this.dialog();
          this.updateListProducts();
        } else {
          this.displayAlert("Product Stock is Not Enough", "is-warning");
        }
      }
    },
    print() {
      window.print();
    },
    clearBasket() {
      this.basket.length = 0;
      this.basket.push({ product: "", qty: 0, price: 0, subTotal: 0 });
    },
    focusToEl() {
      this.$nextTick(() => {
        const input = document.querySelectorAll(".product");
        input[input.length - 1].querySelector("input").focus();
      });
    },
    closePage() {
      this.$emit("close-modal");
    },
    dialog() {
      this.$buefy.dialog.confirm({
        title: "Checkout",
        message:
          "<p class='is-size-6'>Check out successfully <br/> want to print bill ?</p>",
        confirmText: "PRINT",
        cancelText: "NO",
        type: "is-success",
        size: "is-small",
        hasIcon: true,
        onCancel: () => this.clearBasket(),
        onConfirm: () => {
          setTimeout(() => {
            this.print();
          }, 300);
        },
      });
    },
    updateListProducts() {
      const productsName = this.listProducts.map((e) => e.name);

      const result = [];
      this.basket.forEach((e) => {
        const temp = productsName.indexOf(e.product);
        result.push({ index: temp, qty: e.qty });
      });

      this.$emit("update-list-products", result);
    },
    displayAlert(title, type) {
      this.message.title = title;
      this.message.type = type;
      this.message.active = true;
    },
  },
  computed: {
    total() {
      return this.basket.reduce((acc, cur) => {
        return acc + cur.subTotal;
      }, 0);
    },
    tanggal() {
      const today = new Date();
      return (
        today.getDate() +
        "/" +
        parseInt(today.getMonth() + 1) +
        "/" +
        today.getFullYear() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes()
      );
    },
    deleteOrClear() {
      return this.basket.length === 1 ? "CLEAR" : "DELETE";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table tr th {
  font-weight: 400;
  text-transform: uppercase;
}

table tr th:nth-child(2) {
  width: 80px;
}

.modal-card-head,
.modal-card-foot {
  background-color: rgb(170, 51, 51) !important;
}

@media (max-width: 768px) {
  .modal .animation-content {
    width: fit-content !important;
  }
}

@media print {
  .noprint {
    display: none;
  }
  .title {
    padding-top: 60px;
  }
}
</style>
