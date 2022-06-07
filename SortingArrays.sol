// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SortingArrays  {

    uint []  data = [12, 34, 2, 132, 5];

      function sort() public  {
            uint length = data.length;
            for (uint i = 1; i < length; i++) {
                uint key = data[i];
                int j = int(i) - 1;
                while ((int(j) >= 0) && (data[uint(j)] > key)) {
                    data[uint(j + 1)] = data[uint(j)];
                    j--;
                }
                data[uint(j + 1)] = key;
            }
        }

        function getData() public view returns(uint [] memory) {
            return data;
        }

        function SortOneToOne() public {
            
            uint length = data.length;
            if(length == 1) {
                // nothing to do
            } else {
                for (uint i = 1; i < length; i++) {
                uint key = data[i - 1];
                        if(data[i - 1] < data[i]) {
                            data[i - 1] = data[i];
                            data[i] = key;
                        }
                }
            }
        }

         
}
