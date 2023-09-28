<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="container">
          <div class="row q-col-gutter-x-sm">
            <div class="col-auto text-center">
              <RouterLink
                :to="{ name: 'dashboard' }"
                style="text-decoration: inherit"
              >
                <img width="125" src="/logo.png" />
                <span v-if="authStore?.subscription === 'pro'" class="userType"
                  >Pro</span
                >
                <span
                  v-else-if="authStore?.subscription === 'proplus'"
                  class="userType proplus"
                  >ProPlus</span
                >
                <span
                  v-else-if="authStore?.subscription === 'recurring'"
                  class="userType recurring"
                  >Premium</span
                >
              </RouterLink>
            </div>
            <div class="col"></div>
            <div class="gt-sm col-auto">
              <div class="row q-col-gutter-x-sm">
                <div class="col-auto">
                  <q-btn
                    no-caps
                    flat
                    color="ndark"
                    label="Training"
                    :to="{ name: 'training' }"
                  ></q-btn>
                </div>
                <div class="col-auto">
                  <q-btn
                    no-caps
                    flat
                    color="ndark"
                    label="My Stories"
                    :to="{ name: 'dashboard' }"
                  ></q-btn>
                </div>

                <!-- user -->
                <div>
                  <div class="" v-if="authStore.id">
                    <q-btn-dropdown
                      class="capitalize"
                      no-caps
                      fill
                      color="primary"
                      :label="authStore.name || 'Unknown'"
                      dropdown-icon="expand_more"
                    >
                      <q-list class="q-pt-md" dense>
                        <q-item
                          clickable
                          class="text-ndark"
                          :to="{ name: 'user' }"
                        >
                          <q-item-section>
                            <q-item-label>Change Password</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          class="text-ndark"
                          :to="{ name: 'upgrades' }"
                        >
                          <q-item-section>
                            <q-item-label>Upgrades</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          @click="authStore.logout"
                          class="text-red"
                        >
                          <q-item-section>
                            <q-item-label>Logout</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <div v-if="false" class="row no-wrap q-py-md q-pr-md">
                        <div class="column">
                          <div class="text-h6 q-mb-md q-pl-md">Action</div>

                          <q-list>
                            <q-item
                              clickable
                              v-close-popup
                              :to="'/change-password'"
                            >
                              <q-item-section>
                                <q-item-label>Change Password</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>

                        <q-separator vertical inset class="q-mr-lg" />

                        <div class="column items-center">
                          <q-avatar size="72px">
                            <img
                              src="https://cdn.quasar.dev/img/boy-avatar.png"
                            />
                          </q-avatar>

                          <div class="text-subtitle1 q-mt-md q-mb-xs">
                            {{ authStore.name }}
                          </div>

                          <q-btn
                            color="primary"
                            label="Logout"
                            push
                            size="sm"
                            @click="authStore.logout"
                            v-close-popup
                          />
                        </div>
                      </div>
                    </q-btn-dropdown>
                  </div>
                  <div v-else>
                    <q-btn
                      outline
                      no-caps
                      label="Login"
                      :to="{ name: 'login' }"
                    ></q-btn>
                  </div>
                </div>
                <q-btn-dropdown
                  flat
                  color="ndark"
                  dropdown-icon="nope"
                  dense
                  label=""
                  icon-right="o_help"
                  class="no-dropdown-arrow"
                >
                  <div class="q-pa-md">
                    <span>Any questions? </span>
                    <br />
                    <router-link :to="{ name: 'support' }">
                      contact us</router-link
                    >
                  </div>
                </q-btn-dropdown>
              </div>
            </div>
            <div class="col-auto lt-md">
              <q-btn-dropdown
                class="no-dropdown-arrow"
                round
                no-caps
                flat
                icon="menu"
                color="primary"
                dropdown-icon="expand_more"
              >
                <q-list class="q-pt-md">
                  <q-item
                    clickable
                    class="text-ndark"
                    :to="{ name: 'dashboard' }"
                    v-if="authStore.id"
                  >
                    <q-item-section>
                      <q-item-label>My Strories </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    class="text-ndark"
                    :to="{ name: 'training' }"
                  >
                    <q-item-section>
                      <q-item-label>Training</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    class="text-ndark"
                    :to="{ name: 'support' }"
                  >
                    <q-item-section>
                      <q-item-label>Contact</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                </q-list>
                <div class="row no-wrap q-py-md q-pr-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md q-pl-md">Action</div>

                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        class="text-ndark"
                        :to="{ name: 'user' }"
                      >
                        <q-item-section>
                          <q-item-label>Change Password</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        class="text-ndark"
                        :to="{ name: 'upgrades' }"
                      >
                        <q-item-section>
                          <q-item-label>Upgrades</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="authStore.logout"
                        class="text-red"
                      >
                        <q-item-section>
                          <q-item-label>Logout</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <q-separator vertical inset class="q-mr-lg" />

                  <div class="column items-center">
                    <q-avatar
                      size="72px"
                      icon="o_person"
                      text-color="white"
                      color="primary"
                    >
                    </q-avatar>

                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                      {{ authStore.name }}
                    </div>
                  </div>
                </div>
              </q-btn-dropdown>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <!-- show-if-above  -->
    <!-- <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->
    <q-dialog v-model="transcriptionDialog" position="bottom" seamless>
      <TranscriptionProgressMessage
        v-for="audio in audioStore.transcribingAudio"
        :key="audio.id"
        :id="audio.id"
        :estimate="audio.estimate"
      ></TranscriptionProgressMessage>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
    <div class="fixed-bottom-right" style="color: #656781c7">
      v{{ version }}
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { version } from '../../package.json';
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import TranscriptionProgressMessage from 'components/TranscriptionProgressMessage.vue';

import { useAuthStore } from 'src/stores/auth';
import { useAudioStore } from 'src/stores/audio';

const authStore = useAuthStore();
const audioStore = useAudioStore();
const router = useRouter();
const essentialLinks: EssentialLinkProps[] = [];
const leftDrawerOpen = ref(false);
const transDialog = ref(false);

const transcriptionDialog = computed(() => {
  return !!audioStore.transcribingAudio.length;
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onBeforeMount(() => {
  const routes = router.getRoutes();
  // console.log('routes', routes);
  routes.forEach((route, index) => {
    if (routes.length > index + 1) {
      // console.log({ route });
      essentialLinks.push({
        title: route.name as string,
        caption: route.path,
        icon: 'school',
        link: route.path,
        appLink: true,
      });
    }
  });
});
</script>

<style lang="scss">
.q-toolbar {
  height: 68px;
}
</style>
