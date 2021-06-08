<template>
  <div>
  <div class="container">
    <div class="row mt-3">
      <div class="col-12">
        <!-- Main jumbotron for a primary marketing message or call to action -->
        <div class="jumbotron bg-overlay"  :style=bgStyle>
          <div class="container">
            <!--Card content-->
            <div class="mb-3">
            <span class="badge badge-pill badge-success mr-2">
              <i class="fas fa-graduation-cap" v-show="currentProgram.kategori_id == 1"></i>
              <i class="fas fa-heartbeat" v-show="currentProgram.kategori_id == 2"></i>
              <i class="fas fa-mosque" v-show="currentProgram.kategori_id == 3"></i>
              <i class="fas fa-user" v-show="currentProgram.kategori_id == 4"></i>
              <i class="fas fa-atlas" v-show="currentProgram.kategori_id == 5"></i>
              {{ currentProgram.kategori.nama }}
            </span>
<!--              <span v-if="formatDate(currentProgram.createdAt)<=formatDate(currentProgram.deadline)" class="badge badge-pill badge-primary">Ongoing</span>-->
<!--              <span v-if="formatDate(currentProgram.createdAt)>formatDate(currentProgram.deadline)" class="badge badge-pill badge-success">Selesai</span>-->
            </div>
            <h2>{{ currentProgram.judul }}</h2>
            <h6 class="card-text text-justify text-white-50 mt-2 mb-2">
              <span class="font-weight-bold text-white">Terkumpul </span> : {{ currentProgram.wakaf_abadi_terkumpul+currentProgram.wakaf_berjangka_terkumpul | filterMoney }}
            </h6>
<!--            <div style="max-width: 1000px">-->
<!--              <div class="progress" style="height:20px;">-->
<!--                <div class="progress-bar" role="progressbar"-->
<!--                     :style="progressStyle(currentProgram.terkumpul,currentProgram.target)">-->
<!--                  {{ currentProgram.terkumpul | filterMoney }}-->
<!--                </div>-->
<!--              </div>-->
<!--              <h6 class="float-right">Dari  <b>{{ currentProgram.target | filterMoney }}</b></h6>-->
<!--            </div>-->
<!--            <p class="text-left mt-5"><span class="mr-2"><i class="fa fa-calendar"></i></span>{{formatDate(currentProgram.created_at)}} - {{formatDate(currentProgram.deadline)}}</p>-->
<!--            <p class="text-left"><span class="mr-2"><i class="fa fa-sitemap"></i></span>{{ currentProgram.alamat}}</p>-->
            <p><a class="btn btn-primary btn-lg mt-2" href="#" role="button" @click="berWakaf(currentProgram)">Berwakaf</a></p>
          </div>
        </div>

    </div>
  </div>
    <div class="row">
      <div class="col-12">
        <section id="tabs" class="project-tab">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <nav>
                  <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-deskripsi-tab" data-toggle="tab" href="#nav-deskripsi" role="tab"
                       aria-controls="nav-deskripsi" aria-selected="true">Deskripsi</a>
<!--                    <a class="nav-item nav-link" id="nav-wakaf-tab" data-toggle="tab" href="#nav-wakaf" role="tab"-->
<!--                       aria-controls="nav-wakaf" aria-selected="false">Daftar Wakaf</a>-->
                    <a class="nav-item nav-link" id="nav-laporan-tab" data-toggle="tab" href="#nav-laporan" role="tab"
                       aria-controls="nav-laporan" aria-selected="false">Laporan</a>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade show active" id="nav-deskripsi" role="tabpanel" aria-labelledby="nav-deskripsi-tab">
                    <p class="text-left mt-2" >
                      {{currentProgram.deskripsi}}
                    </p>
                  </div>
<!--                  <div class="tab-pane fade" id="nav-wakaf" role="tabpanel" aria-labelledby="nav-wakaf-tab">-->
<!--&lt;!&ndash;                    <select class="form-control mb-3 mt-2 col-md-4 ml-auto" v-model="isAbadi">&ndash;&gt;-->
<!--&lt;!&ndash;                      <option v-bind:value="1" selected>Abadi</option>&ndash;&gt;-->
<!--&lt;!&ndash;                      <option v-bind:value="0">Berjangka</option>&ndash;&gt;-->
<!--&lt;!&ndash;                    </select>&ndash;&gt;-->
<!--&lt;!&ndash;                    <div v-if="isAbadi==1">&ndash;&gt;-->
<!--&lt;!&ndash;                      <vue-good-table&ndash;&gt;-->
<!--&lt;!&ndash;                          :columns="columns"&ndash;&gt;-->
<!--&lt;!&ndash;                          :rows="allWakafAbadi"&ndash;&gt;-->
<!--&lt;!&ndash;                          :search-options="{ enabled: true }"&ndash;&gt;-->
<!--&lt;!&ndash;                          :pagination-options="{enabled: true}"&ndash;&gt;-->
<!--&lt;!&ndash;                          :line-numbers="true">&ndash;&gt;-->
<!--&lt;!&ndash;                        <template slot="table-row" slot-scope="props">&ndash;&gt;-->
<!--&lt;!&ndash;                          <span v-if="props.column.field == 'nominal'">&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{props.row.nominal | filterMoney}}&ndash;&gt;-->
<!--&lt;!&ndash;                                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                          <span v-else>&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{props.formattedRow[props.column.field]}}&ndash;&gt;-->
<!--&lt;!&ndash;                                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </vue-good-table>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    <div v-else-if="isAbadi==0">&ndash;&gt;-->
<!--&lt;!&ndash;                      <vue-good-table&ndash;&gt;-->
<!--&lt;!&ndash;                          :columns="columns"&ndash;&gt;-->
<!--&lt;!&ndash;                          :rows="allWakafBerjangka"&ndash;&gt;-->
<!--&lt;!&ndash;                          :search-options="{ enabled: true }"&ndash;&gt;-->
<!--&lt;!&ndash;                          :pagination-options="{enabled: true}"&ndash;&gt;-->
<!--&lt;!&ndash;                          :line-numbers="true">&ndash;&gt;-->
<!--&lt;!&ndash;                        <template slot="table-row" slot-scope="props">&ndash;&gt;-->
<!--&lt;!&ndash;                          <span v-if="props.column.field == 'nominal'">&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{props.row.nominal | filterMoney}}&ndash;&gt;-->
<!--&lt;!&ndash;                                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                          <span v-else>&ndash;&gt;-->
<!--&lt;!&ndash;                                  {{props.formattedRow[props.column.field]}}&ndash;&gt;-->
<!--&lt;!&ndash;                                </span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </vue-good-table>&ndash;&gt;-->

<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--                  </div>-->
                  <div class="tab-pane fade" id="nav-laporan" role="tabpanel" aria-labelledby="nav-laporan-tab">
                    <div class="container mt-3">
                      <div class="row">
                        <div class="col-12">
                          <section class="content">
                            <div class="container-fluid">
                              <!-- Timelime example  -->
                              <div class="row">
                                <div class="col-md-12">
                                  <!-- The time line -->
                                  <div class="timeline" v-for="laporan in laporannew" v-bind:key="laporan.id">
                                    <!-- timeline time label -->
                                    <div class="time-label">
                                      <span class="bg-red">{{formatDate(laporan.createdAt)}}</span>
                                    </div>
                                    <!-- /.timeline-label -->
                                    <!-- timeline item -->
                                    <div>
                                      <div class="timeline-item">
                                        <div class="timeline-body">
                                          <div class="container">
                                            <div class="row">
                                              <div class="col-4">
                                                <img class="img-thumbnail" :src="'https://wakaf.praditya.web.id/images/'+laporan.gambar"
                                                     alt="Card image cap">
                                              </div>
                                              <div class="col-8">
                                                {{laporan.deskripsi}}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!-- /.col -->
                              </div>
                            </div>
                            <!-- /.timeline -->

                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>


    <!-- Modal -->
  </div>
  </div>
</template>
<script>
  import 'viewerjs/dist/viewer.css'
  import authHeader from '@/services/auth-header'
  import axios from 'axios'
  import $ from 'jquery'
  import moment from "moment";
  const URL = 'https://wakaf.praditya.web.id'
  export default {
    title: 'Detail Program Wakaf',
      created(){
        this.getLaporan();
        console.log(this.currentProgram)
      },
      data() {
        return {
          isAbadi : 1,
          columns: [
            {label: 'Nama Wakif', field: 'nama_wakif'},
            {label: 'Nominal', field: 'nominal'},
            {
              label: 'Dibayar Pada', field: 'created_at',
              type: 'date',
              dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
              dateOutputFormat: 'dd/MM/yyyy'
            },
          ],
          rows : [],
          page: 1,
          per_page: 5,
          displayNow : 0,
          laporannew : [],
          today : moment()
        }
      },

      computed:{
        currentProgram() {
          return this.$store.state.currentProgram.program;
        },
        bgStyle(){
          let bgImg = 'https://wakaf.praditya.web.id/images/'+this.currentProgram.gambar;
          return {

            "background": 'linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url('+bgImg+')'
          }
        },
        allWakafAbadi(){
          let all = [];
          this.currentProgram.wakafabadi.forEach(abadi=> {
            if(abadi.status_pembayaran=='success')
              all.push(abadi)
          })

          return all;
        },
        allWakafBerjangka(){
          let all = [];
          this.currentProgram.wakafberjangka.forEach(berjangka=> {
            if(berjangka.status_pembayaran=='success')
              all.push(berjangka)
          })
          return all;
        }
      },
    methods : {
      berWakaf(program){
          this.$root.$emit("berwakaf", program)
      },
      getLaporan(){
          axios.get(URL + '/api/laporan/' + this.currentProgram.id, {headers: authHeader()}).then(function (response) {
            this.laporannew = response.data;
            console.log(this.currentProgram.id);
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
      displayDeskripsi(){
        this.displayNow = 0
      },
      displayWakaf(){
        this.displayNow = 1
      },
    },
  }
</script>
<style scoped>
.bg-overlay {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  color: #fff;

}
</style>
