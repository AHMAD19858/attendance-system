<template>
   <div class="hidden sm:block">
     <nav aria-label="breadcrumb" class="w-full py-1 px-2">
       <ol class="flex gap-3">
         <li
           class="flex items-center gap-3"
           v-for="(link, index) in links"
           :key="index"
         >
           <nuxt-link
             :to="index != links.length - 1 ? link : ''"
             :class="[
               index == links.length - 1
                 ? 'text-black dark:text-white'
                 : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white',
             ]"
             class="flex items-center capitalize"
           >
             {{
               parseFloat(link.title)
                 ? "Details"
                 : link.title.replace(/[0-9]/g, "")
             }}
           </nuxt-link>
           <span
             v-if="index != links.length - 1"
             class="text-black/40 dark:text-white/40"
             >/</span
           >
         </li>
       </ol>
     </nav>
   </div>
 </template>
 <script setup>
 const counter = useCounter();
 counter.value = 8;
 const route = useRoute();
 const links = computed(() => {
   const fullPath = route.fullPath;
   const params = fullPath.startsWith("/")
     ? fullPath.substring(1).split("/")
     : fullPath.split("/");
   const crumbs = [];
   let path = "";
 
   params.forEach((param, index) => {
     path = `${path}/${param}`;
     crumbs.push({
       title: param.split("?")[0].replaceAll("-", " "),
       path: path,
     });
   });
   return crumbs;
 });
 </script>