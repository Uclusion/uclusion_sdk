/**
 Module for fetching apis. Differs a bit from the rest of the apis,
 in that it mostly works with raw binary streams

 **/

export function Files(client) {

    /**
     * Fetches a file using the path passed in
     * @param path the path to the file
     * @returns a promise for the file
     */
    this.fetchFile = function(path) {
        return client.doGet('', path);
    }
}