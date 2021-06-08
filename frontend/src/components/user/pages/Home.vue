<template>
  <div>
    <!-- Main content -->
    <section class="content mt-3">
      <div class="container-fluid">
        <!-- Info boxes -->
        <div class="row mb-1">
          <div class="col-12">
            <h4>Statistik</h4>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-md-3">
            <div class="info-box">
              <span class="info-box-icon bg-info elevation-1"><i class="fas fa-money-check"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Wakaf Abadi</span>
                <span class="info-box-number">
                  {{ wakafabadi.length}}
                </span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="info-box mb-3">
              <span class="info-box-icon bg-danger elevation-1"><i class="fas fa-money-check-alt"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Wakaf Berjangka</span>
                <span class="info-box-number">{{ wakafberjangka.length}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->

          <!-- fix for small devices only -->
          <div class="clearfix hidden-md-up"></div>

          <div class="col-12 col-sm-6 col-md-3">
            <div class="info-box mb-3">
              <span class="info-box-icon bg-success elevation-1"><i class="fas fa-shopping-cart"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Total Wakaf Uang Dibayarkan</span>
                <span class="info-box-number">{{total | filterMoney}}</span>
              </div>
              <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
        <div class="row mt-2 mb-1">
          <div class="col-12">
            <h4>Pembayaran Wakaf Terbaru</h4>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7">
            <!-- TABLE: LATEST ORDERS -->
            <div class="card">
              <div class="card-header border-transparent">
                <div class="card-tools">
                  <select class="custom-select form-control-border" v-model="isAbadi">
                    <option v-bind:value="true">Abadi</option>
                    <option v-bind:value="false">Berjangka</option>
                  </select>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body p-0">
                <div class="table-responsive" v-if="isAbadi==true">
                  <table class="table m-0">
                    <thead>
                    <tr>
                      <th>Program</th>
                      <th>Tanggal</th>
                      <th>Nominal</th>
                      <th>Metode Pembayaran</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="w in latestWakafAbadi.slice(0, 5)" v-bind:key="w.id">
                      <td>{{w.program_wakaf.judul}}</td>
                      <td>{{formatDate(w.created_at)}}</td>
                      <td>{{w.nominal | filterMoney}}</td>
                      <td>
                        <img src="@/assets/images/logo_bank_bca.png" height="20px" v-if="w.metode_pembayaran=='bca'">
                        <img src="@/assets/images/logo-bni.png" height="20px" v-else-if="w.metode_pembayaran=='bni'">
                        <img src="@/assets/images/logo-bri.png" height="20px" v-else-if="w.metode_pembayaran=='bri'">
                        <img src="@/assets/images/qris.png" height="20px" v-else-if="w.metode_pembayaran=='gopay'">
                        <img src="@/assets/images/indomaret.png" height="20px" v-else-if="w.metode_pembayaran=='indomaret'">
                        <img src="@/assets/images/alfamart.png" height="20px" v-else-if="w.metode_pembayaran=='alfamart'">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-responsive" v-else-if="isAbadi==false">
                  <table class="table m-0">
                    <thead>
                    <tr>
                      <th>Program</th>
                      <th>Tanggal</th>
                      <th>Nominal</th>
                      <th>Tanggal Pembayaran</th>
                      <th>Metode Pembayaran</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="w in latestWakafBerjangka.slice(0, 5)" v-bind:key="w.id">
                      <td>{{w.program_wakaf.judul}}</td>
                      <td>{{w.tanggal}}</td>
                      <td>{{w.nominal | filterMoney}}</td>
                      <td>{{w.jatuh_tempo}}</td>
                      <td>
                        <img src="@/assets/images/logo_bank_bca.png" height="20px" v-if="w.metode_pembayaran=='bca'">
                        <img src="@/assets/images/logo-bni.png" height="20px" v-else-if="w.metode_pembayaran=='bni'">
                        <img src="@/assets/images/logo-bri.png" height="20px" v-else-if="w.metode_pembayaran=='bri'">
                        <img src="@/assets/images/qris.png" height="20px" v-else-if="w.metode_pembayaran=='gopay'">
                        <img src="@/assets/images/indomaret.png" height="20px" v-else-if="w.metode_pembayaran=='indomaret'">
                        <img src="@/assets/images/alfamart.png" height="20px" v-else-if="w.metode_pembayaran=='alfamart'">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.table-responsive -->
              </div>
              <!-- /.card-body -->
              <div class="card-footer clearfix">
                <router-link v-if="isAbadi==true" to="/home/wakaf/abadi" class="btn btn-sm btn-success float-right">Selengkapnya</router-link>
                <router-link v-else-if="isAbadi==false" to="/home/wakaf/berjangka" class="btn btn-sm btn-success float-right">Selengkapnya</router-link>
              </div>
              <!-- /.card-footer -->
            </div>
            <!-- /.card -->
          </div>
          <div class="col-lg-5">

          </div>
        </div>
        <div class="row mt-2 mb-1">
          <div class="col-12">
            <h4>Rekomendasi Program Wakaf Uang</h4>
          </div>
        </div>
        <div class="row mt-2 mb-1">
          <div class="container">
            <div class="row clearfix">
              <div class="col-md-4 float-left" v-for="program in latestPrograms.slice(0,3)" :key="program.id">
                <!--Card-->
                <div class="card card-cascade narrower mb-4">

                  <!-- Card image -->
                  <img class="card-img-top" :src="'https://wakaf.praditya.web.id/images/'+program.gambar" alt="Card image cap">
                  <a href="#!">
                    <div class="mask rgba-white-slight"></div>
                  </a>

                  <!--Card content-->
                  <div class="card-body card-body-cascade p-3">
            <span class="badge badge-pill badge-success mb-2">
              <i class="fas fa-graduation-cap" v-show="program.kategori_id == 1"></i>
              <i class="fas fa-heartbeat" v-show="program.kategori_id == 2"></i>
              <i class="fas fa-mosque" v-show="program.kategori_id == 3"></i>
              <i class="fas fa-user" v-show="program.kategori_id == 4"></i>
              <i class="fas fa-atlas" v-show="program.kategori_id == 5"></i>
              {{ program.kategori.nama }}
            </span>
<!--                    <span class="badge badge-pill badge-danger mr-1"><i-->
<!--                        class="fas fa-calendar"></i> {{ formatDate(program.deadline) }}</span>-->
<!--                    <span v-if="formatDate(program.createdAt)<=formatDate(program.deadline)" class="badge badge-pill badge-primary">Ongoing</span>-->
<!--                    <span v-if="formatDate(program.createdAt)>formatDate(program.deadline)" class="badge badge-pill badge-success">Selesai</span>-->
                    <br>
                    <!--Title-->
                    <h4 class="card-title mb-2" style="font-size: 20px;font-weight: bold">{{ program.judul }}</h4>
                    <!--Text-->
                    <p class="card-text text-justify" style="font-size: 12px;">
                      {{ program.deskripsi | truncate(150, '...') }}
                    </p>
                    <!-- Linkedin -->
<!--                    <div class="progress" style="height:20px">-->
<!--                      <div class="progress-bar" role="progressbar" :style="progressStyle(program.terkumpul,program.target)">-->
<!--                        {{program.terkumpul | filterMoney}}-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <h6 class="float-right">Dari <b>{{program.target | filterMoney}}</b></h6>-->
                    <a href="" class="btn btn-primary mt-2 mr-1">Berwakaf</a>
                    <a href="" class="btn btn-success mt-2">More</a>
                  </div>
                  <!-- Card footer -->
                  <div class="card-footer text-muted text-center" style="font-size: 10px">
                    {{ formatDate(program.created_at) }}
                  </div>
                  <!--/.Card content-->

                </div>
                <!--/.Card-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import authHeader from '@/services/auth-header'
import axios from 'axios'
import moment from 'moment'
const URL = 'https://wakaf.praditya.web.id'
// import numeral from 'numeral';
export default {
  title: 'Home',
  computed: {
    latestWakafAbadi: function() {
      return this.wakafabadi.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    latestWakafBerjangka: function() {
      return this.wakafberjangka.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    latestPrograms: function() {
      return this.programs.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    currentUser() {
      return this.$store.state.auth.user.data;
    },
    total(){
      let totalWakafAbadi = [], totalWakafBerjangka = [];

      Object.entries(this.wakafabadi).forEach(([key, val]) => {
        totalWakafAbadi.push(parseInt(val.nominal)) // the value of the current key.
        console.log(key);
      });
      Object.entries(this.wakafberjangka).forEach(([key, val]) => {
        totalWakafBerjangka.push(parseInt(val.nominal)) // the value of the current key.
        console.log(key);

      });
      return totalWakafAbadi.reduce(function(total, num){ return total + num }, 0)+totalWakafBerjangka.reduce(function(total, num){ return total + num }, 0);
    }
  },
  mounted() {
    this.getAllPrograms();
    this.getAllWakafAbadi();
    this.getAllWakafBerjangka();
    // this.getAllUsers();
  },
  data(){
    return {
      isAbadi : true,
      wakafabadi: [],
      wakafberjangka : [],
      // users : [],
      programs : [],
    }
  },
  methods : {
    getAllPrograms() {
      axios.get(URL + '/api/program-wakaf/all',{headers: authHeader()}).then(function (response) {
        this.programs = response.data.data;
      }.bind(this));
    },
    getAllWakafAbadi() {
      axios.get(URL + '/api/wakaf-abadi/',{headers: authHeader()}).then(function (response) {
        this.wakafabadi = response.data.data;
      }.bind(this));
    },
    getAllWakafBerjangka() {
      axios.get(URL + '/api/wakaf-berjangka/',{headers: authHeader()}).then(function (response) {
        this.wakafberjangka = response.data.data;
      }.bind(this));
    },
    formatDate(dm) {
      return moment(dm).format('DD/MM/YYYY');
    },
    progressStyle(terkumpul, total) {
      return {
        "width": (terkumpul / total) * 100 + '%',
        height: `${this.height}px`
      };
    },
  }
}
</script>
<style scoped>
.card-img-top {
  width: 100%;
  height: 18vw;
  object-fit: cover;
}
</style>
