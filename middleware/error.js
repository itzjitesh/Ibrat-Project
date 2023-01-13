
export default function (err, req, res, next){
    res.send(500).render("error", {
        message: err.message
    });
}