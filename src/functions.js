module.exports = {
	pgcd: function(a, b) { // Algorithme d'Euclide  
	  while (b>0) {   
	      var r=a%b;  
	      a=b;  
	      b=r;  
	    }  
	  return (a);
	},
	prem: function(nbr)
	{
  	var estPrem = new Boolean(true);
  	var j=0;
  	for(j=2;j<nbr;j++)
	  {
   		if(nbr%j==0) estPrem=false; 
 		}
		return(nbr+' est premier : '+estPrem);
	}
};
