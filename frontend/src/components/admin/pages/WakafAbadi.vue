<template>
  <div>
    <div class="col-12 mt-3">
      <!-- Button trigger modal -->
      <div class="card">
        <div class="card-header border-0">
          <h3 class="card-title"><b>Daftar Wakaf Abadi</b></h3>
        </div>
        <div class="card-body table-responsive p-0">
          <vue-good-table
              :columns="columns"
              :rows="rows"
              :search-options="{ enabled: true }"
              :pagination-options="{enabled: true}"
              :line-numbers="true">
            <template slot="table-row" slot-scope="props">
                                <span v-if="props.column.field == 'action'">
                                     <a href="#" class="mr-2" @click="viewWakaf(props.row.id)">
                                       <span class="text-primary">More...</span>
                                     </a>
                                </span>
                                <span v-else-if="props.column.field == 'nominal'">
                                  {{props.row.nominal | filterMoney}}
                                </span>
                                <span v-else-if="props.column.field == 'metode_pembayaran'">
                                        <img :src="'http://localhost:4000/images/logo_bank_bca.png'" height="20px" v-if="props.row.metode_pembayaran=='bca'">
                                        <img :src="'http://localhost:4000/images/logo-bni.png'" height="20px" v-else-if="props.row.metode_pembayaran=='bni'">
                                        <img :src="'http://localhost:4000/images/logo-bri.png'" height="20px" v-else-if="props.row.metode_pembayaran=='bri'">
                                        <img :src="'http://localhost:4000/images/qris.png'" height="20px" v-else-if="props.row.metode_pembayaran=='gopay'">
                                        <img :src="'http://localhost:4000/images/indomaret.png'" height="20px" v-else-if="props.row.metode_pembayaran=='indomaret'">
                                        <img :src="'http://localhost:4000/images/alfamart.png'" height="20px" v-else-if="props.row.metode_pembayaran=='alfamart'">
                                </span>
                                <span v-else>
                                  {{props.formattedRow[props.column.field]}}
                                </span>
            </template>
          </vue-good-table>
        </div>
      </div>
      <!-- /.card -->
    </div>

    <!-- Modal -->
    <div class="modal fade" id="viewWakaf" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-hover">
              <tbody>
              <tr>
                <th scope="row">Nominal</th>
                <td>{{wakaf.nominal | filterMoney}}</td>
              </tr>
              <tr>
                <th scope="row">Metode Pembayaran</th>
                <td>
                  <img :src="'http://localhost:4000/images/logo_bank_bca.png'" height="20px" v-if="wakaf.metode_pembayaran=='bca'">
                  <img :src="'http://localhost:4000/images/logo-bni.png'" height="20px" v-else-if="wakaf.metode_pembayaran=='bni'">
                  <img :src="'http://localhost:4000/images/logo-bri.png'" height="20px" v-else-if="wakaf.metode_pembayaran=='bri'">
                  <img :src="'http://localhost:4000/images/qris.png'" height="20px" v-else-if="wakaf.metode_pembayaran=='gopay'">
                  <img :src="'http://localhost:4000/images/indomaret.png'" height="20px" v-else-if="wakaf.metode_pembayaran=='indomaret'">
                  <img :src="'http://localhost:4000/images/alfamart.png'" height="20px" v-else-if="wakaf.metode_pembayaran=='alfamart'">
                </td>
              </tr>
              <tr>
                <th scope="row">Status Pembayaran</th>
                <td>{{wakaf.status_pembayaran}}</td>
              </tr>
              <tr>
                <th scope="row">Tanggal Bayar</th>
                <td>{{moment(wakaf.created_at).format('DD/MM/YYYY')}}</td>
              </tr>
              <tr v-if="wakaf.program!=undefined">
                <th scope="row">Program Wakaf</th>
                <td>{{wakaf.program.judul}}</td>
              </tr>
              <tr>
                <th scope="row">Cetak</th>
                <td>
                  <button type="button" class="btn btn-primary mr-2">Sertifikat Wakaf</button>
                  <button type="button" class="btn btn-primary">Akta Ikrar Wakaf</button>
                </td>
              </tr>
              </tbody>
            </table>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import axios from 'axios';
import $ from "jquery";
import moment from 'moment'
import authHeader from '../../../services/auth-header-admin.service';

const URL = 'http://localhost:4000'
export default {
  title: 'Daftar Wakaf Abadi',
  created() {
    this.getAllWakafAbadi();
    this.$on('AfterCreated', () => {
      this.getAllWakafAbadi();
    });
  },
  data() {
    return {
      columns: [
        {label: 'Wakif', field : 'wakif.nama'},
        {label: 'Nominal', field: 'nominal'},
        {label: 'Atas Nama', field: 'nama_wakif'},
        {label: 'Metode Pembayaran', field: 'metode_pembayaran'},
        {label: 'Program Wakaf', field: 'program_wakaf.judul'},
        {
          label: 'Dibayar Pada', field: 'created_at',
          type: 'date',
          dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          dateOutputFormat: 'dd/MM/yyyy'
        },
        {label : 'Action', field : 'action'}
      ],
      rows: [],
      page: 1,
      per_page: 10,
      wakaf: {},
      submitted : false,
      categories : []
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    moment: function (value) {
      return moment(value);
    },
    getAllWakafAbadi() {
      axios.get(URL + '/api/admin/wakaf-abadi/all', {headers: authHeader()}).then(function (response) {
        this.rows = response.data;
      }.bind(this));

    },
    viewWakaf(id){
      $("#viewWakaf").modal('show');
      axios.get(URL + '/api/admin/wakaf-abadi/' + id, {headers: authHeader()}).then(function (response) {
        this.wakaf = response.data;
      }.bind(this));
    }

  }
}
</script>
