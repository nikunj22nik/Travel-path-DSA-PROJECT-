function creategraph(V, E) {
  let adjacency_list = [];
  for (let i = 0; i < V; i++) {
    adjacency_list.push([]);
  }

  for (let i = 0; i < E.length; i++) {
    adjacency_list[E[i][0] - 1].push([E[i][1] - 1, E[i][2]]);
    adjacency_list[E[i][1] - 1].push([ E[i][0] - 1, E[i][2]]);
  }
  return adjacency_list;
}


function djikstra(graph, V, src){

let vis=Array(V).fill(0);

let dist=[];

for(let i=0;i<V;i++)
dist.push([10000,-1]);
dist[src][0] = 0;
for(let i=0;i<V-1;i++){
     let mn=-1;

 for(let j=0;j<V;j++){

   if(vis[j]===0){

if(mn==-1||dist[j][0]<dist[mn][0]) {mn=j;}
   
}

 }

vis[mn]=1;

for(let k=0;k<graph[mn].length;k++){
let edge=graph[mn][k];
if(vis[edge[0]]==0&& dist[edge[0]][0]>dist[mn][0]+edge[1]){
    dist[edge[0]][0]=dist[mn][0]+edge[1];
    dist[edge[0]][1]=mn;
          }

    }
}

return dist;


}





let v = 5;

let Edge = [
  [1, 2, 3],
  [1,2,5],
  [1, 4, 2],
  [3, 4, 3],
  [3, 5, 1],
];
const graph = creategraph(v, Edge);
console.log(djikstra(graph,5,0));
//console.log(graph);
// let len=10;
// let count=0;
// while(count<100){
// console.log(Math.floor(Math.random()*len));

// count++;
// }






    // create a network
    const container = document.getElementById('container');
    const genNew = document.getElementById('gen_graph');

    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '17px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face:"FontAwesome",
                code: '\uf015',
                size: 40,
                color: 'black',
            }
        }
    };

    // initialize your network!
    const network = new vis.Network(container);
    //console.log("my options are");
    network.setOptions(options);

    function createData(){
      //  console.log("in a cretae datayupus");
        const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya'];

        // Initialising number of nodes in graoh dynamically
        let V = Math.floor(Math.random() * cities.length) ;
if(V<4){
    V=5;
}
        // Preparing node data for Vis.js
        let vertices = [];
        for(let i=0;i<V;i++){
            console.log(cities[i]+"mycity");
            vertices.push({id:i, label: cities[i], shape:"icon",
            icon:{face:"FontAwesome",code:"\uf015",color:"#6cf7a2",size:30}});
        }
//'"Font Awesome 5 Free"'
        // Preparing edges for Vis.js
        let edges = [];
        for(let i=1;i<V;i++){
            // Picking a neighbour from 0 to i-1 to make edge to
            let neigh = Math.floor(Math.random()*i);

            // Adding the edge between node and neighbour
            edges.push({from: i, to: neigh, color: 'orange',label: String(Math.floor(Math.random()*70)+30)});
        }

        //Preparing data object for Vis.js
        const data = {
            nodes: vertices,
            edges: edges
        };
        return data;
    }

    genNew.onclick = function () {
        // Creating and setting data to network
        console.log("hii");
        let data = createData();
        network.setData(data);
    };
  
  
    genNew.click();







































