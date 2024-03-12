const path = require('path');
const db = require("../db.js");
const fs = require('fs');

const getBots = (req, res) => {
    const query = `
    SELECT 
    b.bot_id, 
    b.name, 
    b.description,
    b.bot_path,
    b.image_path,
    b.backtest_image_path,
    GROUP_CONCAT(c.name SEPARATOR ', ') AS currencies
FROM bots b
LEFT JOIN bot_currencies bc ON b.bot_id = bc.bot_id
LEFT JOIN currencies c ON bc.currency_id = c.id
GROUP BY b.bot_id, b.name, b.description, b.bot_path, b.image_path,b.backtest_image_path;

`;

db.query(query, (err, results) => {
    if (err) {
        console.error('Failed to fetch bots and their currencies:', err);
        res.status(500).json({ message: 'Error fetching bots and their currencies' });
    } else {
        // Process results to format as needed
        const bots = results.map(row => ({
            id: row.bot_id,
            name: row.name,
            description: row.description,
            image : row.image_path,
            bot : row.bot_path,
            backtest : row.backtest_image_path,
            currencies: row.currencies ? row.currencies.split(', ') : []
        }));
        res.json(bots);
    }
});
};


const deleteBot = (req, res) => {
  const botId = req.params.botId;
  console.log(botId)

  // Start database transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Error starting transaction', error: err });
    }

    // First, select the paths from the bots table
    const selectPathsQuery = 'SELECT bot_path, image_path FROM bots WHERE bot_id = ?';

    db.query(selectPathsQuery, [botId], (selectErr, results) => {
      if (selectErr || results.length === 0) {
        db.rollback(() => {
          console.error('Error selecting bot paths:', selectErr);
          return res.status(500).json({ message: 'Error selecting bot paths', error: selectErr });
        });
        return;
      }

      // Paths of files to delete
      const botPath = results[0].bot_path;
      const imagePath = results[0].image_path;

      // Delete files from the filesystem
      fs.unlink(path.join(__dirname, botPath), unlinkBotErr => {
        if (unlinkBotErr) {
          db.rollback(() => {
            console.error('Error deleting bot file:', unlinkBotErr);
            return res.status(500).json({ message: 'Error deleting bot file', error: unlinkBotErr });
          });
          return;
        }

        fs.unlink(path.join(__dirname, imagePath), unlinkImageErr => {
          if (unlinkImageErr) {
            db.rollback(() => {
              console.error('Error deleting image file:', unlinkImageErr);
              return res.status(500).json({ message: 'Error deleting image file', error: unlinkImageErr });
            });
            return;
          }

          // After successfully deleting files, delete references in the database
          const deleteBotCurrenciesQuery = 'DELETE FROM bot_currencies WHERE bot_id = ?';
          db.query(deleteBotCurrenciesQuery, [botId], (bcErr, bcResult) => {
            if (bcErr) {
              db.rollback(() => {
                console.error('Error deleting bot currencies:', bcErr);
                return res.status(500).json({ message: 'Error deleting bot currencies', error: bcErr });
              });
              return;
            }

            const deleteBotQuery = 'DELETE FROM bots WHERE bot_id = ?';
            db.query(deleteBotQuery, [botId], (botErr, botResult) => {
              if (botErr) {
                db.rollback(() => {
                  console.error('Error deleting bot:', botErr);
                  return res.status(500).json({ message: 'Error deleting bot', error: botErr });
                });
                return;
              }

              // If all operations are successful, commit the transaction
              db.commit(commitErr => {
                if (commitErr) {
                  db.rollback(() => {
                    console.error('Error committing transaction:', commitErr);
                    return res.status(500).json({ message: 'Failed to commit transaction', error: commitErr });
                  });
                  return;
                }

                // Send success response
                res.json({
                  success: true,
                  message: 'Bot, image, and related currencies successfully deleted',
                });
              });
            });
          });
        });
      });
    });
  });
};

module.exports = { getBots,deleteBot };
