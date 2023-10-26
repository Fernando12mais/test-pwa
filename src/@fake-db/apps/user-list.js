import avatar1 from "@images/avatars/avatar-1.png";
import avatar2 from "@images/avatars/avatar-2.png";
import avatar3 from "@images/avatars/avatar-3.png";
import avatar4 from "@images/avatars/avatar-4.png";
import avatar5 from "@images/avatars/avatar-5.png";
import avatar6 from "@images/avatars/avatar-6.png";
import avatar7 from "@images/avatars/avatar-7.png";
import avatar8 from "@images/avatars/avatar-8.png";
import mock from "@/@fake-db/mock";
function randomDate(start, end) {

  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  
  const randomMs = Math.random() * (endDate - startDate)
  const randomDate = new Date(startDate.getTime() + randomMs)

  return randomDate
}

const LastAccess  = randomDate(new Date(2020, 0, 1), new Date())
function format(date) {
  const dd = date.getDate().toString().padStart(2, '0')
  const mm = (date.getMonth() + 1).toString().padStart(2, '0') 
  const yy = date.getFullYear().toString()

  return `${dd}/${mm}/${yy}` 
}

const formatted = format(LastAccess) // '06/02/23'


const users = [
  {
    id: 1,
    nameUser: "Users",
    fullName: "Galen Slixby",
    company: "Passini",
    role: "Vendedor",
    country: "El Salvador",
    contact: "(479) 232-9151",
    email: "gslixby0@abc.net.au",
    currentPlan: "enterprise",
    status: "inativo",
    billing: "Auto Debit",
    avatar: "",
    LastAcess: formatted ,
  },
  {
    id: 2,

    nameUser: "Halsey",
    fullName: "Halsey Redmore",
    company: "Giros",
    role: "caixa",
    country: "Albania",
    contact: "(472) 607-9137",
    email: "hredmore1@imgur.com",
    currentPlan: "team",
    status: "ativo",
    avatar: avatar1,
    billing: "Manual - Paypal",
    LastAcess: formatted,
  },
  {
    id: 3,

    nameUser: "Users",
    fullName: "Marjory Sicely",
    company: "Porto Borrachas",
    role: "financeiro",
    country: "BRasil",
    contact: "(321) 264-4599",
    email: "msicely2@who.int",
    currentPlan: "enterprise",
    status: "ativo",
    avatar: avatar1,
    billing: "Manual - Cash",
    LastAcess: formatted,
  },
  {
    id: 4,

    nameUser: "Users",
    fullName: "Cyrill Risby",
    company: "Marauto",
    role: "caixa",
    country: "China",
    contact: "(923) 690-6806",
    email: "crisby3@wordpress.com",
    currentPlan: "team",
    status: "inativo",
    avatar: avatar3,
    billing: "Manual - Credit Card",
    LastAcess: formatted,
  },
  {
    id: 5,

    nameUser: "Users",
    fullName: "Maggy Hurran",
    company: "Mais Barato",
    role: "subscriber",
    country: "Pakistan",
    contact: "(669) 914-1078",
    email: "mhurran4@yahoo.co.jp",
    currentPlan: "enterprise",
    status: "ativo",
    avatar: avatar1,
    billing: "Auto Debit",
    LastAcess: formatted,
  },
  {
    id: 6,

    nameUser: "Users",
    fullName: "Silvain Halstead",
    company: "Bauer",
    role: "author",
    country: "China",
    contact: "(958) 973-3093",
    email: "shalstead5@shinystat.com",
    currentPlan: "company",
    status: "ativo",
    avatar: "",
    LastAcess: formatted,
    billing: "Manual - Cash",
  },
  {
      id: 7,
      nameUser: "usuario1",
      fullName: "Ricardo Souza",
      company: "Passini",
      role: "admin",
      country: "Brasil",
      contact: "(841) 889-3339",
      email: "rsouza1@exemplo.com",
      currentPlan: "basic",
      status: "ativo",
      avatar: avatar8,
      LastAcess: formatted,
      billing: "Manual - Paypal",
    },
    {
      id: 8,
      nameUser: "usuario2",
      fullName: "Ana Silva",
      company: "Giros",
      role: "subscriber",
      country: "Brasil",
      contact: "(764) 885-7351",
      email: "asilva2@exemplo.com",
      currentPlan: "company",
      status: "ativo",
      avatar: avatar4,
      LastAcess: formatted,
      billing: "Manual - Paypal",
    },
    {
      id: 9,
      nameUser: "usuario3",
      fullName: "João Santos",
      company: "Bauer",
      role: "maintainer",
      country: "Brasil",
      contact: "(350) 589-8520",
      email: "jsantos3@exemplo.com",
      currentPlan: "company",
      status: "ativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Manual - Paypal",
    },
    {
      id: 10,
      nameUser: "usuario11",
      fullName: "Aline Oliveira",
      company: "Marauto",
      role: "admin",
      country: "Brasil",
      contact: "(912) 345-6789",
      email: "aoliveira11@exemplo.com",
      currentPlan: "basic",
      status: "inativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Auto Debit",
    },
    {
      id: 11,
      nameUser: "usuario12",
      fullName: "Guilherme Pereira",
      company: "Porto de Borrachas",
      role: "subscriber",
      country: "Brasil",
      contact: "(987) 654-3210",
      email: "gpereira12@exemplo.com",
      currentPlan: "team",
      status: "ativo",
      avatar: avatar3,
      LastAcess: formatted,
      billing: "Manual - Paypal",
    },
    {
      id: 12,
      nameUser: "usuario13",
      fullName: "Larissa Ferreira",
      company: "Passini",
      role: "maintainer",
      country: "Brasil",
      contact: "(543) 210-9876",
      email: "lferreira13@exemplo.com",
      currentPlan: "enterprise",
      status: "ativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Auto Debit",
    },
    {
      id: 61,
      nameUser: "usuario21",
      fullName: "Rafael Costa",
      company: "Giros",
      role: "vendedor",
      country: "Brasil",
      contact: "(123) 456-7890",
      email: "rcosta21@exemplo.com",
      currentPlan: "basic",
      status: "inativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Manual - Credit Card",
    },
    {
      id: 62,
      nameUser: "usuario22",
      fullName: "Fernanda Silva",
      company: "Bauer",
      role: "admin",
      country: "Brasil",
      contact: "(987) 654-3210",
      email: "fsilva22@exemplo.com",
      currentPlan: "team",
      status: "ativo",
      avatar: avatar3,
      LastAcess: formatted,
      billing: "Manual - Paypal",
    },
    {
      id: 63,
      nameUser: "usuario23",
      fullName: "João Santos",
      company: "Porto de Borrachas",
      role: "caixa",
      country: "Brasil",
      contact: "(543) 210-9876",
      email: "jsantos23@exemplo.com",
      currentPlan: "enterprise",
      status: "ativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Auto Debit",
    },
    {
      id: 64,
      nameUser: "usuario24",
      fullName: "Maria Oliveira",
      company: "Passini",
      role: "financeiro",
      country: "Brasil",
      contact: "(111) 222-3333",
      email: "moliveira24@exemplo.com",
      currentPlan: "basic",
      status: "ativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Manual - Credit Card",
    },
   
    {
      id: 65, 
      nameUser: "josedasilva",
      fullName: "José Silva",
      company: "Giros", 
      role: "vendedor",
      country: "Brasil", 
      contact: "(222) 333-4444",
      email: "josesilva@exemplo.com",
      currentPlan: "enterprise", 
      status: "inativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Auto Debit",
    },
 
  
    {
      id: 74,
      nameUser: "anacosta", 
      fullName: "Ana Costa",
      company: "Marauto",
      role: "admin",
      country: "Brasil",
      contact: "(999) 888-7777",
      email: "anacosta@exemplo.com",
      currentPlan: "team",
      status: "ativo",
      avatar: "",
      LastAcess: formatted,
      billing: "Manual - Cash",
    }
  ];

// 👉  return users
mock.onGet("/apps/users/list").reply((config) => {
  const {
    q = "",
    role = null,
    plan = null,
    status = null,
    LastAcess = null,
    company = null,
    perPage = 5,
    currentPage = 1,
  } = config.params ?? {};
  const queryLower = q.toLowerCase();
  let filteredUsers = users
  
    .filter(
      (user) =>
        (user.fullName.toLowerCase().includes(queryLower) ||
          user.email.toLowerCase().includes(queryLower) ||
          user.company.toLocaleLowerCase().includes(queryLower)) &&
        user.role === (role || user.role) &&
        user.LastAcess === (LastAcess || user.LastAcess) &&
        user.currentPlan === (plan || user.currentPlan) &&
        user.company === (company || user.company) &&
        user.status === (status || user.status)
    )
    .reverse();
  const totalPage = Math.ceil(filteredUsers.length / perPage)
    ? Math.ceil(filteredUsers.length / perPage)
    : 1;
  const totalUsers = filteredUsers.length;
  if (perPage) {
    const firstIndex = (currentPage - 1) * perPage;
    const lastIndex = perPage * currentPage;

    filteredUsers = filteredUsers.slice(firstIndex, lastIndex);
  }
  

  return [200, { users: filteredUsers, totalPage, totalUsers }];
  
});

// 👉 Add user
mock.onPost("/apps/users/user").reply((config) => {
  const { user } = JSON.parse(config.data);
  const { length } = users;
  let lastIndex = 0;
  if (length) lastIndex = users[length - 1].id;
  user.id = lastIndex + 1;
  users.push(user);

  return [201, { user }];
});
mock.onGet(/\/apps\/users\/\d+/).reply((config) => {
  // Get event id from URL
  const userId = config.url?.substring(config.url.lastIndexOf("/") + 1);

  // Convert Id to number
  const Id = Number(userId);
  const userIndex = users.findIndex((e) => e.id === Id);
  const user = users[userIndex];

  Object.assign(user, {
    taskDone: 1230,
    projectDone: 568,
    taxId: "Tax-8894",
    language: "English",
  });
  if (user) return [200, user];

  return [404];
});



