class MockSorter {
    sort(a: any, b: any, index: Number, direction: string) {
            let itemA = a.data[index];
            let itemB = b.data[index];

            let nameA, nameB;

            if(typeof itemA == 'object'){
                nameA = itemA.label.toLowerCase();
            } else if(Number.isInteger(itemA)) {
                nameA = itemA;
            } else {
                nameA = itemA.toString().toLowerCase();
            }

            if(typeof itemB == 'object'){
                nameB = itemB.label.toLowerCase();
            } else if(Number.isInteger(itemB)) {
                nameB = itemB;
            } else {
                nameB = itemB.toString().toLowerCase();
            }

            if (direction == 'ascending') {
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
            } else {
                if (nameA < nameB) return 1;
                if (nameA > nameB) return -1;
            }
            return 0;
    }
}

export default new MockSorter();